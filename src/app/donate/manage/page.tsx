import type { Metadata } from "next";
import { DonationManagement } from "../../components/donate/DonationManagement";

export const metadata: Metadata = {title:"Manage your support · Vinteum",robots:{index:false,follow:false},referrer:"no-referrer"};
export default function DonationManagementPage(){return <DonationManagement/>;}
