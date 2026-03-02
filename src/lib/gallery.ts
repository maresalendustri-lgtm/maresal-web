/**
 * Shared gallery images. Keep in sync with maresal-web src/components/Gallery.jsx GALLERY_IMAGES.
 */
export type GalleryImage = {
  url: string;
  alt: string;
  cat: string;
  span?: "normal" | "wide" | "tall";
};

export const GALLERY_IMAGES: GalleryImage[] = [
  { url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=90", alt: "Uçak kanadı detayı", cat: "Havacılık", span: "wide" },
  { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=90", alt: "Metal işleme atölyesi", cat: "Metal", span: "normal" },
  { url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90", alt: "Alüminyum parça imalatı", cat: "Alüminyum", span: "tall" },
  { url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=90", alt: "CNC torna üretimi", cat: "Metal", span: "normal" },
  { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=90", alt: "Kalite kontrol laboratuvarı", cat: "Kalite", span: "wide" },
  { url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=90", alt: "Havacılık bileşenleri", cat: "Havacılık", span: "normal" },
  { url: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=1200&q=90", alt: "Hassas CMM ölçüm", cat: "Kalite", span: "normal" },
  { url: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=1200&q=90", alt: "Montaj süreçleri", cat: "Metal", span: "tall" },
  { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=90", alt: "5 Eksen CNC frezeleme", cat: "Metal", span: "normal" },
  { url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=90", alt: "Türbin parçası üretimi", cat: "Havacılık", span: "wide" },
  { url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=90", alt: "Anodize yüzey işlemi", cat: "Alüminyum", span: "normal" },
  { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=90", alt: "NDT tahribatsız muayene", cat: "Kalite", span: "normal" },
];

export const GALLERY_CATEGORIES = ["Tümü", "Havacılık", "Metal", "Alüminyum", "Kalite"] as const;
