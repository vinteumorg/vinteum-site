import type { Metadata } from "next";
import { Suspense } from "react";
import { getPeople } from "@/lib/people";
import { PeopleDirectory } from "../components/people/PeopleDirectory";
import { DirectoryView } from "../components/people/PeopleViews";

export const metadata: Metadata = {
    title: "Proof of work | Vinteum",
    description: "Explore Vinteum contributors and their open-source work for Bitcoin.",
    alternates: { canonical: "/people" },
};

export default function Page() {
    const people = getPeople();
    return (
        <Suspense fallback={<PeopleDirectory people={people} />}>
            <DirectoryView people={people} />
        </Suspense>
    );
}
