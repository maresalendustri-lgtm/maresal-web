import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BUSINESS } from "@/lib/business";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: "Mareşal | Havacılık & Metal İşleme",
    template: "%s | Mareşal",
  },
  description:
    "ISO 9001, 14001 ve 45001 sertifikalı havacılık ve savunma sanayi için alüminyum, titanyum ve çelik işleme hizmetleri. Mareşal Mühendislik Danışmanlık Yazılım İthalat Ve İhracat Sanayi Ticaret Limited Şirketi.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BUSINESS.url,
    siteName: BUSINESS.name,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: BUSINESS.googleVerification
    ? { google: BUSINESS.googleVerification }
    : undefined,
};

function LocalBusinessJsonLd() {
  const hasAddress =
    BUSINESS.address.streetAddress ||
    BUSINESS.address.addressLocality ||
    BUSINESS.address.postalCode;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BUSINESS.url}/#organization`,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.name,
    url: BUSINESS.url,
    logo: `${BUSINESS.url}/logo.png`,
    description:
      "Savunma, havacılık ve ağır sanayi sektörlerinde mühendislik çözümleri, sertifikalı alüminyum tedariki ve sürdürülebilir geri dönüşüm hizmetleri.",
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    ...(hasAddress && {
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.streetAddress || undefined,
        addressLocality: BUSINESS.address.addressLocality,
        addressRegion: BUSINESS.address.addressRegion || undefined,
        postalCode: BUSINESS.address.postalCode || undefined,
        addressCountry: BUSINESS.address.addressCountry,
      },
    }),
    ...(BUSINESS.googleMapsUrl && { hasMap: BUSINESS.googleMapsUrl }),
    ...(BUSINESS.sameAs.length > 0 && { sameAs: BUSINESS.sameAs }),
    areaServed: "TR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <LocalBusinessJsonLd />
        {children}
      </body>
    </html>
  );
}
