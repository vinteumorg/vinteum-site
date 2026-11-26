import type { Metadata } from "next";
import { DonationSupporters } from "../../components/donate/DonationsExperience";

export const metadata: Metadata = { title: "Community supporters · Vinteum", alternates:{canonical:"/donate/supporters"} };
export default function DonationSupportersPage() { return <DonationSupporters/>; }
