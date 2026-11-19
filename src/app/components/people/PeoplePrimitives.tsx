"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Person } from "@/data/people";
import { Button } from "../shared/Button";
import styles from "./people.module.css";

export function PersonAvatar({ person, priority = false }: { person: Person; priority?: boolean }) {
    const [failedImage, setFailedImage] = useState<string>();
    return (
        <div className={styles.avatar} data-illustration={person.illustration ? "true" : undefined}>
            {person.image && failedImage !== person.image ? (
                <Image
                    src={person.image}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 45vw, 320px"
                    loading={priority ? "eager" : "lazy"}
                    onError={() => setFailedImage(person.image)}
                />
            ) : (
                <span className={styles.initial} aria-hidden="true">
                    {person.name[0].toUpperCase()}
                </span>
            )}
        </div>
    );
}

export function PeopleHeroArt() {
    return (
        <div className={styles.heroArt} aria-hidden="true">
            <div />
        </div>
    );
}

export function PeopleSupport() {
    const { t } = useLanguage();
    return (
        <section className={styles.support} aria-labelledby="people-support-title">
            <div>
                <h2 id="people-support-title">{t("people.supportTitle")}</h2>
                <p>{t("people.supportDescription")}</p>
            </div>
            <Button href="/donate">
                {t("people.supportAction")} <span aria-hidden="true">↗</span>
            </Button>
        </section>
    );
}
