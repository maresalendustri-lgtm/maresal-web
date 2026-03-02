import HeroSlider from "@/components/HeroSlider";
import StatsSection from "@/components/StatsSection";
import HomeBlocks from "@/components/HomeBlocks";
import HomeGallery from "@/components/HomeGallery";
import HomeContact from "@/components/HomeContact";
import { getGalleryImages } from "@/lib/actions/gallery";

export default async function HomePage() {
  const galleryImages = await getGalleryImages();
  const homeGalleryImages = galleryImages.slice(0, 6);

  return (
    <>
      <HeroSlider />
      <StatsSection />
      <HomeBlocks />
      <HomeGallery images={homeGalleryImages} />
      <HomeContact />
    </>
  );
}
