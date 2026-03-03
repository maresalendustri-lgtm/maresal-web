"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { GalleryImage } from "@/lib/gallery";

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = createAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("gallery_images")
    .select("url, alt, cat, span")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    url: row.url,
    alt: row.alt,
    cat: row.cat,
    span: (row.span as "normal" | "wide" | "tall") || "normal",
  }));
}

export async function saveGalleryImages(
  images: GalleryImage[]
): Promise<void> {
  const supabase = createAdminSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  await supabase.from("gallery_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (images.length === 0) {
    revalidatePath("/galeri");
    revalidatePath("/admin/galeri");
    return;
  }

  const rows = images.map((img, i) => ({
    url: img.url,
    alt: img.alt,
    cat: img.cat,
    span: img.span || "normal",
    sort_order: i,
  }));

  const { error } = await supabase.from("gallery_images").insert(rows);

  if (error) throw new Error(`Galeri kaydetme hatası: ${error.message}`);

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}
