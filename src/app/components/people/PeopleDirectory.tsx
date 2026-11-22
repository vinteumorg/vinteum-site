"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { filterPeople, getDirectoryRoleDetails, getProjectLabel, type Person } from "@/data/people";
import { PeopleHeroArt, PersonAvatar } from "./PeoplePrimitives";
import styles from "./people.module.css";

const roles = ["all", "grantee", "fellow", "alumni", "team"] as const;

const REVEAL_TARGETS = [`.${styles.peopleGrid} > li`, `.${styles.directoryHero} > *`];

export function PeopleDirectory({ people, filters = "" }: { people: Person[]; filters?: string }) {
    const { locale, t } = useLanguage();
    const params = new URLSearchParams(filters);
    const role = roles.find((value) => params.get("role") === value) ?? "all";
    const focus = params.get("focus") ?? "";
    const query = params.get("q") ?? "";
    const areas = [...new Set(people.flatMap(({ focus }) => focus))].sort();
    const filtered = filterPeople(people, { role, focus, query, locale });
    const rootRef = useRef<HTMLDivElement>(null);
    useScrollReveal(rootRef, {
        targets: REVEAL_TARGETS,
        hiddenClass: styles.revealHidden,
        visibleClass: styles.revealVisible,
        resetKey: `${role}:${focus}:${query}`,
    });

    function updateFilter(key: string, value: string) {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        const search = next.toString();
        window.history.replaceState(null, "", search ? `/people?${search}` : "/people");
    }

    return (
        <div className={styles.people} ref={rootRef}>
            <section className={`${styles.hero} ${styles.directoryHero}`} aria-labelledby="people-title">
                <div className={styles.container}>
                    <h1 id="people-title">{t("people.title")}</h1>
                    <p>{t("people.description")}</p>
                </div>
                <PeopleHeroArt />
            </section>
            <div className={styles.filterBar}>
                <div className={`${styles.container} ${styles.filters}`}>
                    <div className={styles.roleFilters} role="group" aria-label={t("people.filterRole")}>
                        {roles.map((value) => (
                            <button type="button" key={value} aria-pressed={role === value}
                                onClick={() => updateFilter("role", value === "all" ? "" : value)}>
                                {t(`people.filters.${value}`)}
                            </button>
                        ))}
                    </div>
                    {areas.length > 0 && (
                        <div className={styles.focusFilter}>
                            <select aria-label={t("people.focus")} value={focus}
                                onChange={(event) => updateFilter("focus", event.target.value)}>
                                <option value="">{t("people.allFocus")}</option>
                                {areas.map((area) => <option key={area}>{area}</option>)}
                            </select>
                        </div>
                    )}
                    <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
                        <input type="search" value={query} onChange={(event) => updateFilter("q", event.target.value)}
                            aria-label={t("people.search")} placeholder={t("people.search")} />
                    </form>
                    <span className="sr-only" role="status">
                        {filtered.length} {t(filtered.length === 1 ? "people.countSingular" : "people.count")}
                    </span>
                </div>
            </div>
            <div className={`${styles.container} ${styles.directoryBody}`}>
                {filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>{t("people.empty")}</p>
                        <button type="button" onClick={() => window.history.replaceState(null, "", "/people")}>
                            {t("people.clearFilters")}
                        </button>
                    </div>
                ) : (
                    <ul className={styles.peopleGrid}>
                        {filtered.map((person, index) => {
                            const project = getProjectLabel(person, locale);
                            const { role: personRole, title } = getDirectoryRoleDetails(person, locale);
                            return (
                                <li key={person.slug}>
                                    <Link href={`/people/${person.slug}`} className={styles.personCard}>
                                        <PersonAvatar person={person} priority={index < 4} />
                                        <h2>{person.name}</h2>
                                        {project && <p>{project}</p>}
                                        {personRole && (
                                            <span className={styles.role} data-role={personRole}>
                                                {title ?? t(`people.roles.${personRole}`)}
                                                {person.board && <span className={styles.boardTag}>{t("people.roles.board")}</span>}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
