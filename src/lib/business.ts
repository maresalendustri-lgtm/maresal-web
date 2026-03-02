/**
 * Centralized business info for SEO and Google Business Profile connection.
 * Update these values to match your Google Business Profile exactly.
 *
 * Google Business setup:
 * 1. Go to https://business.google.com and add/claim your business
 * 2. Add your website URL (maresal.com.tr)
 * 3. Get verification code: Business Profile → Business info → Website → Verify
 * 4. Add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to .env.local
 * 5. Copy your Google Maps URL and add NEXT_PUBLIC_GOOGLE_MAPS_URL to .env.local
 * 6. Ensure NAP (Name, Address, Phone) matches exactly on website and Google Business
 */
export const BUSINESS = {
  /** Display name */
  name: "Mareşal",
  /** Full legal company name (matches Google Business) */
  legalName:
    "Mareşal Mühendislik Danışmanlık Yazılım İthalat Ve İhracat Sanayi Ticaret Limited Şirketi",
  /** Website URL */
  url: "https://maresal.com.tr",
  /** Primary email */
  email: "info@maresal.com.tr",
  /** Primary phone (E.164 format for tel: links) */
  phone: "+90 312 000 00 00",
  /** Display phone */
  phoneDisplay: "+90 (312) 000 00 00",
  /** Full address - must match Google Business exactly */
  address: {
    streetAddress: "",
    addressLocality: "Ankara",
    addressRegion: "",
    postalCode: "",
    addressCountry: "TR",
  },
  /** Google Business Profile / Google Maps URL - add when verified */
  googleMapsUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "",
  /** Google site verification code (from Search Console / Business) */
  googleVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  /** Social / business profile URLs for sameAs */
  sameAs: [] as string[],
  /** Ana hizmet - navbar'da ayrı gösterilir */
  mainService: {
    slug: "yuksek-teknoloji-aluminyum-m5-serisi",
    label: "Yüksek Teknoloji",
  },
} as const;
