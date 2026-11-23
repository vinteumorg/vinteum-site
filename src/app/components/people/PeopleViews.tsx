"use client";

import { useSearchParams } from "next/navigation";
import type { Person } from "@/data/people";
import { PeopleDirectory } from "./PeopleDirectory";
import { PersonProfile } from "./PersonProfile";

export function DirectoryView({ people }: { people: Person[] }) {
    const query = useSearchParams();
    return <PeopleDirectory people={people} filters={query.toString()} />;
}

export function ProfileView({ person, relatedPeople }: { person: Person; relatedPeople: Person[] }) {
    const query = useSearchParams();
    return <PersonProfile person={person} relatedPeople={relatedPeople} requestedTab={query.get("tab")} requestedType={query.get("type")} />;
}
