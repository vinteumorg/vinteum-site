"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPersonDate, getAffiliationStatusLabel, getOrganizationLogo, getPrimaryParticipation, getProfileRelationships, getProfileSections, sortProfileItems, type AcademicPublication, type Affiliation, type Person, type ProfileItem, type ProfileSection } from "@/data/people";
import Markdown from "react-markdown";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PeopleHeroArt, PeopleSupport, PersonAvatar } from "./PeoplePrimitives";
import styles from "./people.module.css";

type Section = "overview" | ProfileSection;

const REVEAL_TARGETS = [
    `.${styles.contentHeading}`,
    `.${styles.projects} > li`,
    `.${styles.itemList} > li`,
    `.${styles.mediaGrid} > li`,
    `.${styles.sidebar} > section`,
    `.${styles.support} > *`,
];
type ContentSection = ProfileSection;

function ItemList({ items }: { items: (ProfileItem & Partial<AcademicPublication>)[] }) {
    const { locale, t } = useLanguage();
    return (
        <ul className={styles.itemList}>
            {sortProfileItems(items).map((item) => (
                    <li key={item.id} className={item.featured ? styles.featuredItem : undefined}>
                        {item.featured && <p className={styles.featuredLabel}>{t("people.featuredContribution")}</p>}
                        <div className={styles.itemHeading}>
                            <h3>
                                {item.href ? (
                                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                                        {item.title[locale]} <span aria-hidden="true">↗</span>
                                    </a>
                                ) : (
                                    item.title[locale]
                                )}
                            </h3>
                            {item.date && (
                                <time dateTime={item.date}>{formatPersonDate(item.date, locale)}</time>
                            )}
                        </div>
                        {item.authors && <p className={styles.itemMeta}>{item.authors.join("; ")}</p>}
                        {item.doi && <p className={styles.itemMeta}>DOI: {item.doi}</p>}
                        {item.publicationType && (
                            <p className={styles.itemMeta}>{[t(`people.publicationTypes.${item.publicationType}`), item.venue].filter(Boolean).join(" · ")}</p>
                        )}
                        {(item.type || item.source) && (
                            <p className={styles.itemMeta}>{[item.type && t(`people.contributionTypes.${item.type}`), item.source].filter(Boolean).join(" · ")}</p>
                        )}
                        {item.description && (
                            <p className={styles.itemDescription}>{item.description[locale]}</p>
                        )}
                    </li>
                ))}
        </ul>
    );
}

function MediaCard({ item }: { item: ProfileItem }) {
    const { locale, t } = useLanguage();
    const [failedImage, setFailedImage] = useState(false);
    const isVideo = item.mediaType === "video";
    const content = (
        <>
            {(item.thumbnail || item.mediaType || item.source) && <div className={styles.mediaThumbnail}>
                {item.thumbnail && !failedImage ? (
                    <Image
                        src={item.thumbnail}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1000px) 45vw, 360px"
                        onError={() => setFailedImage(true)}
                    />
                ) : (
                    <span className={styles.mediaPlaceholder} aria-hidden="true">
                        {item.badge && <span className={styles.mediaEdition}>{item.badge}</span>}
                        {item.source}
                    </span>
                )}
                {item.mediaType && (
                    <span className={styles.mediaBadge}>{isVideo ? t("people.mediaVideo") : t("people.mediaArticle")}</span>
                )}
                {isVideo && (
                    <span className={styles.mediaPlay} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                    </span>
                )}
            </div>}
            <div className={styles.mediaDetails}>
                <h3>{item.title[locale]} {item.href && <span aria-hidden="true">↗</span>}</h3>
                {item.source && <p>{item.source}</p>}
                {item.date && <time dateTime={item.date}>{formatPersonDate(item.date, locale)}</time>}
            </div>
        </>
    );
    return (
        <li className={styles.mediaCard}>
            {item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer">{content}</a> : <div>{content}</div>}
        </li>
    );
}

function MediaGrid({ items }: { items: ProfileItem[] }) {
    return <ul className={styles.mediaGrid}>{items.map((item) => <MediaCard key={item.id} item={item} />)}</ul>;
}

function AffiliationDetails({ entry }: { entry: Affiliation }) {
    const { locale, t } = useLanguage();
    const { start, end, status } = entry;
    const statusLabel = getAffiliationStatusLabel(entry);
    return (
        <p>
            {entry.role[locale]}
            {statusLabel && ` · ${t(`people.${statusLabel}`)}`}
            {start && <> · <time dateTime={start}>{formatPersonDate(start, locale)}</time></>}
            {end && <>{start ? " – " : ` · ${t("people.affiliationEnd")} `}<time dateTime={end}>{formatPersonDate(end, locale)}</time></>}
            {start && !end && status === "current" && ` – ${t("people.present")}`}
        </p>
    );
}

function OrganizationIcon({ organization }: { organization: string }) {
    const logo = getOrganizationLogo(organization);
    return (
        <span
            className={styles.organizationIcon}
            style={logo?.background ? { background: logo.background } : undefined}
            aria-hidden="true"
        >
            {logo ? (
                organization === "Vinteum" ? (
                    <span className={styles.logoCrop}>
                        <Image src={logo.src} alt="" width={78} height={20} />
                    </span>
                ) : (
                    <Image className={styles.affiliationLogo} src={logo.src} alt="" width={25} height={25} />
                )
            ) : organization.slice(0, 2)}
        </span>
    );
}

function ProfileSidebar({ person, relatedPeople }: { person: Person; relatedPeople: Person[] }) {
    const { locale, t } = useLanguage();
    const { affiliations, programs } = getProfileRelationships(person);
    return (
        <aside className={styles.sidebar} aria-label={t("people.profileDetails")}>
            {!!affiliations.length && (
                <section>
                    <h2>{t("people.affiliations")}</h2>
                    <ul className={styles.affiliations}>
                        {affiliations.map((affiliation, index) => (
                            <li key={`${affiliation.organization}-${affiliation.start}-${index}`}>
                                <OrganizationIcon organization={affiliation.organization} />
                                <div>
                                    <h3>
                                        {affiliation.href ? (
                                            <Link href={affiliation.href}>
                                                {affiliation.organization}
                                            </Link>
                                        ) : (
                                            affiliation.organization
                                        )}
                                    </h3>
                                    <AffiliationDetails entry={affiliation} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {!!programs.length && (
                <section>
                    <h2>{t("people.programs")}</h2>
                    <ul className={styles.programs}>
                        {programs.map((program, index) => (
                            <li key={`${program.program}-${index}`}>
                                <h3>
                                    {program.href ? (
                                        <Link href={program.href}>{program.name}</Link>
                                    ) : (
                                        program.name
                                    )}
                                </h3>
                                <p>{t("people.by")} {program.organization}{program.cohort && ` · ${t("people.cohort")} ${program.cohort}`}</p>
                                {program.role && <AffiliationDetails entry={{ ...program, role: program.role }} />}
                                {program.work && <p>{program.work[locale]}</p>}
                                {program.description && <p>{program.description[locale]}</p>}
                                {program.fundedBy && <p>{t("people.fundedBy")} {program.fundedBy}</p>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {!!person.focus.length && (
                <section>
                    <h2>{t("people.focus")}</h2>
                    <ul className={styles.focusTags}>
                        {person.focus.map((area) => (
                            <li key={area}>
                                <Link href={`/people?focus=${encodeURIComponent(area)}`}>
                                    {area}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {!!person.connections.length && (
                <section>
                    <h2>{t("people.connections")}</h2>
                    <ul className={styles.connections}>
                        {person.connections.map((connection) => {
                            const related = relatedPeople.find(
                                (person) => person.slug === connection.slug,
                            );
                            return related ? (
                                <li key={related.slug}>
                                    <Link href={`/people/${related.slug}`}>
                                        <PersonAvatar person={related} />
                                        <div>
                                            <h3>{related.name}</h3>
                                            <p>{connection.reason[locale]}</p>
                                        </div>
                                    </Link>
                                </li>
                            ) : null;
                        })}
                    </ul>
                </section>
            )}
        </aside>
    );
}

export function PersonProfile({
    person,
    relatedPeople = [],
    requestedTab,
    requestedType,
}: {
    person: Person;
    relatedPeople?: Person[];
    requestedTab?: string | null;
    requestedType?: string | null;
}) {
    const { locale, t } = useLanguage();
    const rootRef = useRef<HTMLDivElement>(null);
    const availableSections = getProfileSections(person);
    const primary = getPrimaryParticipation(person) ?? person.affiliations.find(({ directoryRole }) => directoryRole);
    const requested = requestedTab;
    const active: Section = availableSections.includes(requested as ContentSection)
        ? (requested as ContentSection)
        : "overview";
    useScrollReveal(rootRef, {
        targets: REVEAL_TARGETS,
        hiddenClass: styles.revealHidden,
        visibleClass: styles.revealVisible,
        resetKey: `${active}:${requestedType ?? "all"}`,
    });
    const contributionTypes = [
        ...new Set(person.contributions.map((item) => item.type).filter(Boolean)),
    ];
    const contributionType = contributionTypes.find((type) => type === requestedType) ?? "all";
    const contributionItems = person.contributions.filter(
        (item) => contributionType === "all" || item.type === contributionType,
    );

    useLayoutEffect(() => {
        if (active === "overview") return;

        const headingId = `heading-${active}`;
        if (window.location.hash !== `#${headingId}`) return;

        const heading = document.getElementById(headingId);
        heading?.focus({ preventScroll: true });
        heading?.scrollIntoView({ block: "start", behavior: "instant" });
    }, [active]);

    function sectionLink(section: Section, type?: string) {
        const query = new URLSearchParams();
        if (section !== "overview") query.set("tab", section);
        if (type && type !== "all") query.set("type", type);
        return `/people/${person.slug}${query.size ? `?${query}` : ""}`;
    }

    return (
        <div className={styles.people} ref={rootRef}>
            <section
                className={`${styles.hero} ${styles.profileHero}`}
                aria-labelledby="person-title"
            >
                <div className={`${styles.container} ${styles.profileIntro}`}>
                    <div className={styles.profileText}>
                        <Link className={styles.backLink} href="/people">
                            ← {t("people.directory")}
                        </Link>
                        {primary && (
                            <p className={styles.eyebrow}>
                                {primary.organization} · {primary.status === "past" ? t("people.roles.alumni") : primary.role[locale]}
                                {person.board && <span className={styles.boardTag}>{t("people.roles.board")}</span>}
                            </p>
                        )}
                        <h1 id="person-title">{person.name}</h1>
                        {(person.handle || person.pseudonymous) && (
                            <p className={styles.handle}>
                                {person.handle && `@${person.handle}`}
                                {person.pseudonymous && `${person.handle ? " · " : ""}${t("people.pseudonymous")}`}
                            </p>
                        )}
                        {person.bio && (
                            <div className={styles.bio}>
                                <Markdown skipHtml>{person.bio[locale]}</Markdown>
                            </div>
                        )}
                        {!!person.links.length && (
                            <ul className={styles.socialLinks}>
                                {person.links.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.icon && link.icon !== "scholar" && (
                                                <Image
                                                    src={`/assets/icons/social/${link.icon === "website" ? "blog" : link.icon}.svg`}
                                                    width={15}
                                                    height={15}
                                                    alt=""
                                                />
                                            )}
                                            {link.label} <span aria-hidden="true">↗</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {person.updatedAt && (
                            <p className={styles.profileUpdated}>
                                {t("people.updated")}{" "}
                                <time dateTime={person.updatedAt}>
                                    {formatPersonDate(person.updatedAt, locale, true)}
                                </time>
                            </p>
                        )}
                    </div>
                    <div className={styles.profilePortrait}>
                        <PersonAvatar person={person} priority />
                    </div>
                </div>
                <PeopleHeroArt />
            </section>
            {availableSections.length > 0 && (
                <nav className={styles.sectionBar} aria-label={t("people.profileNavigation")}>
                    <div className={`${styles.container} ${styles.sectionLinks}`}>
                        {(["overview", ...availableSections] as Section[]).map((section) => (
                            <Link
                                key={section}
                                href={sectionLink(section)}
                                scroll={false}
                                aria-current={active === section ? "page" : undefined}
                            >
                                {t(`people.tabs.${section}`)}
                                {section !== "overview" && <sup>{person[section].length}</sup>}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
            <div className={`${styles.container} ${styles.profileBody}`}>
                <div className={styles.profileColumns}>
                    {availableSections.length > 0 && <div className={styles.profileMain}>
                        {availableSections
                            .filter((section) => active === "overview" || section === active)
                            .map((section) => {
                                const isOverview = active === "overview";
                                const items = person[section];
                                const visibleCount = isOverview ? (section === "media" || section === "courses" ? 2 : 3) : items.length;
                                return (
                                    <section
                                        key={section}
                                        aria-labelledby={`heading-${section}`}
                                        className={styles.contentSection}
                                    >
                                        <div className={styles.contentHeading}>
                                            <h2 id={`heading-${section}`} tabIndex={-1}>
                                                {t(`people.headings.${section}`)}
                                            </h2>
                                            {isOverview && items.length > visibleCount && (
                                                <Link href={`${sectionLink(section)}#heading-${section}`} scroll={false}>
                                                    {t(section === "media" ? "people.viewAllMedia" : "people.viewAll")} {items.length}
                                                </Link>
                                            )}
                                        </div>
                                        {section === "contributions" && !isOverview && (
                                            <div
                                                className={styles.contributionFilters}
                                                role="group"
                                                aria-label={t("people.contributionType")}
                                            >
                                                <Link
                                                    href={sectionLink(section)}
                                                    scroll={false}
                                                    aria-current={
                                                        contributionType === "all"
                                                            ? "true"
                                                            : undefined
                                                    }
                                                >
                                                    {t("people.filters.all")}{" "}
                                                    <span>{person.contributions.length}</span>
                                                </Link>
                                                {contributionTypes.map((type) => (
                                                    <Link
                                                        key={type}
                                                        href={sectionLink(section, type)}
                                                        scroll={false}
                                                        aria-current={
                                                            contributionType === type
                                                                ? "true"
                                                                : undefined
                                                        }
                                                    >
                                                        {t(`people.contributionTypes.${type}`)}{" "}
                                                        <span>
                                                            {
                                                                person.contributions.filter(
                                                                    (item) => item.type === type,
                                                                ).length
                                                            }
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {section === "projects" ? (
                                            <ul className={styles.projects}>
                                                {person.projects
                                                    .slice(0, visibleCount)
                                                    .map((project) => (
                                                        <li key={project.name}>
                                                            <div className={styles.projectHeading}>
                                                                <h3>
                                                                    {project.href ? (
                                                                        <a href={project.href} target="_blank" rel="noopener noreferrer">
                                                                            {project.name} <span aria-hidden="true">↗</span>
                                                                        </a>
                                                                    ) : project.name}
                                                                </h3>
                                                                {project.current === false && (
                                                                    <span>{t("people.past")}</span>
                                                                )}
                                                            </div>
                                                            {project.description && <p>{project.description[locale]}</p>}
                                                            {project.contribution && <p className={styles.projectRole}>{project.contribution[locale]}</p>}
                                                        </li>
                                                    ))}
                                            </ul>
                                        ) : section === "media" || section === "courses" ? (
                                            <MediaGrid items={person[section].slice(0, visibleCount)} />
                                        ) : (
                                            <>
                                                <ItemList
                                                    items={(section === "contributions" &&
                                                    !isOverview
                                                        ? sortProfileItems(contributionItems)
                                                        : sortProfileItems(person[section])
                                                    ).slice(0, visibleCount)}
                                                />
                                                {section === "contributions" &&
                                                    !isOverview &&
                                                    contributionItems.length === 0 && (
                                                        <p className={styles.emptyState}>
                                                            {t("people.noContributions")}
                                                        </p>
                                                    )}
                                            </>
                                        )}
                                    </section>
                                );
                            })}
                    </div>}
                    {(person.affiliations.length > 0 || person.programs.length > 0 || person.focus.length > 0 || relatedPeople.length > 0) &&
                        <ProfileSidebar person={person} relatedPeople={relatedPeople} />}
                </div>
                <PeopleSupport />
            </div>
        </div>
    );
}
