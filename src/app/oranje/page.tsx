import type { Metadata } from "next";
import { OranjeLanding } from "../components/oranje/OranjeLanding";

const title = "Quem desenvolve o Bitcoin? | Vinteum";
const description = "Conheça o trabalho de quem desenvolve Bitcoin. A Vinteum forma, orienta e financia desenvolvedores e pesquisadores open source no Brasil.";

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: "/oranje" },
    openGraph: {
        title,
        description,
        url: "/oranje",
        siteName: "Vinteum",
        type: "website",
        locale: "pt_BR",
        alternateLocale: ["en_US"],
        images: [{ url: "/assets/images/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/assets/images/og-image.png"],
    },
};

export default function OranjePage() {
    return <OranjeLanding />;
}
