import type { Metadata } from "next";
import { DonationsExperience } from "../../components/donate/DonationsExperience";

export const metadata: Metadata = { title: "Support Bitcoin development · Vinteum", robots: {index:false,follow:false}, alternates:{canonical:"/donate"} };
export default function DonationPreview() { return <DonationsExperience/>; }
