import { cache } from "react";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { text, type Person } from "../data/people.ts";

const directory = path.join(process.cwd(), "content", "people");
const localized = z.object({ EN: z.string().trim().min(1), BR: z.string().trim().min(1) });
const date = z.string()
    .regex(/^\d{4}(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?)?$/)
    .refine((value) => {
        if (value.length !== 10) return true;
        const parsed = new Date(`${value}T00:00:00Z`);
        return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
    }, "Use a valid calendar date.");

const link = z.string().refine((value) => {
    if (value.startsWith("/")) return /^\/(?![\/\\])[^\\\s]*$/.test(value);
    if (!/^https?:\/\//i.test(value)) return false;
    return URL.canParse(value);
}, "Use an http(s) URL or a local path.");
const image = z.string().regex(/^\/(?![\/\\])[^\\\s]+$/, "Use a path under public/.");

const item = z.object({
    id: z.string().min(1),
    title: localized,
    date: date.optional(),
    source: z.string().optional(),
    featured: z.boolean().optional(),
    thumbnail: image.optional(),
    badge: z.string().trim().max(12).optional(),
    mediaType: z.enum(["video", "article"]).optional(),
    type: z.string().optional(),
    description: localized.optional(),
    href: link.optional(),
});
const affiliation = z.object({
    organization: z.string().trim().min(1),
    role: localized,
    directoryRole: z.enum(["team", "fellow"]).optional(),
    status: z.enum(["current", "past"]).optional(),
    start: date.optional(),
    end: date.optional(),
    href: link.optional(),
});
const socialLink = z.union([link, z.string().regex(/^mailto:[^\s]+$/)]);
const schema: z.ZodType<Person> = z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().trim().min(1),
    image: image.optional(),
    alternateImage: image.optional(),
    illustration: z.boolean().optional(),
    board: z.boolean().optional(),
    handle: z.string().trim().min(1).optional(),
    pseudonymous: z.boolean().optional(),
    location: localized.optional(),
    bio: localized.optional(),
    updatedAt: date.optional(),
    projectLabel: z.string().trim().min(1).optional(),
    focus: z.array(z.string().trim().min(1)).default([]),
    links: z
        .array(
            z.object({
                label: z.string().min(1),
                href: socialLink,
                icon: z
                    .enum(["github", "gitlab", "twitter", "nostr", "website", "blog", "youtube", "linkedin", "discord", "instagram", "keybase", "email", "scholar"])
                    .optional(),
            }),
        )
        .refine((links) => new Set(links.map(({ href }) => href)).size === links.length, "Profile links must use distinct URLs.")
        .default([]),
    affiliations: z.array(affiliation).default([]),
    programs: z.array(affiliation.extend({
        program: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        name: z.string().trim().min(1),
        cohort: z.number().int().positive().optional(),
        work: localized.optional(),
        description: localized.optional(),
        fundedBy: z.string().trim().min(1).optional(),
    })).default([]),
    projects: z
        .array(
            z.object({
                name: z.string().trim().min(1),
                href: link.optional(),
                description: localized.optional(),
                contribution: localized.optional(),
                current: z.boolean().optional(),
            }),
        )
        .default([]),
    contributions: z
        .array(
            item.extend({
                type: z.enum(["PR", "Code Review", "Research", "Tooling", "Documentation", "Protocol Specification"]),
            }),
        )
        .default([]),
    discussions: z.array(item).default([]),
    writing: z.array(item).default([]),
    publications: z.array(item.extend({
        authors: z.array(z.string().trim().min(1)).min(1),
        venue: z.string().trim().min(1),
        publicationType: z.enum(["paper", "conference-abstract", "preprint", "masters-thesis", "doctoral-thesis"]),
        doi: z.string().regex(/^10\.\d{4,9}\/\S+$/).optional(),
        href: link,
    })).default([]),
    courses: z.array(item).default([]),
    media: z.array(item).default([]),
    connections: z.array(z.object({ slug: z.string(), reason: localized })).default([]),
});

function biography(content: string): Person["bio"] {
    const clean = content.replace(/<!--[\s\S]*?-->/g, "").trim();
    if (!clean) return undefined;
    const sections = clean.split(/^## (EN|PT)\s*$/m);
    if (sections.length === 1) return text(clean, clean);
    const languages: Record<string, string> = {};
    for (let index = 1; index < sections.length; index += 2) {
        languages[sections[index]] = sections[index + 1].trim();
    }
    const english = languages.EN || languages.PT || "";
    const portuguese = languages.PT || languages.EN || "";
    return english || portuguese ? text(english, portuguese) : undefined;
}

export function parseProfile(file: string, markdown: string): Person {
    if (!file.endsWith(".md")) throw new Error(`Invalid profile filename: ${file}`);
    try {
        const { data, content } = matter(markdown);
        return schema.parse({ ...data, slug: file.slice(0, -3), bio: biography(content) ?? data.bio });
    } catch (error) {
        throw new Error(`Invalid profile ${file}`, { cause: error });
    }
}

export function readPeople(contentDirectory = directory): Person[] {
    const people = readdirSync(contentDirectory, { withFileTypes: true })
        .filter((file) => file.isFile() && file.name.endsWith(".md") && file.name !== "README.md")
        .map(({ name }) => parseProfile(name, readFileSync(path.join(contentDirectory, name), "utf8")))
        .sort((a, b) => a.name.localeCompare(b.name, "en"));

    const slugs = new Set(people.map(({ slug }) => slug));
    for (const person of people) {
        for (const connection of person.connections) {
            if (!slugs.has(connection.slug) || connection.slug === person.slug) {
                throw new Error(`Invalid profile connection: ${person.slug} → ${connection.slug}`);
            }
        }
    }
    return people;
}

export const getPeople = cache(readPeople);

export function getPerson(slug: string): Person | undefined {
    return getPeople().find((person) => person.slug === slug);
}
