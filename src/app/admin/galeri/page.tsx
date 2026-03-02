import { getGalleryImages } from "@/lib/actions/gallery";
import AdminGalleryClient from "@/components/admin/AdminGalleryClient";

export default async function AdminGalleryPage() {
  const initialImages = await getGalleryImages();

  return <AdminGalleryClient initialImages={initialImages} />;
}
