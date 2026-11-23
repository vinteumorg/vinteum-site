import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPeople, getPerson } from "@/lib/people";
import { PersonProfile } from "../../components/people/PersonProfile";
import { ProfileView } from "../../components/people/PeopleViews";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return getPeople().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const person = getPerson((await params).slug);
    if (!person) notFound();

    const title = `${person.name} | Vinteum`;
    const description = `${person.name} — Vinteum contributor profile`;
    const url = `/people/${person.slug}`;
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, ...(person.image && { images: [person.image] }) },
    };
}

export default async function Page({ params }: PageProps) {
    const person = getPerson((await params).slug);
    if (!person) notFound();

    const relatedPeople = getPeople().filter(({ slug }) =>
        person.connections.some((connection) => connection.slug === slug),
    );
    return (
        <Suspense fallback={<PersonProfile person={person} relatedPeople={relatedPeople} />}>
            <ProfileView person={person} relatedPeople={relatedPeople} />
        </Suspense>
    );
}
