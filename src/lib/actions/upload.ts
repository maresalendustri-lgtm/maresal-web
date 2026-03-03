"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";

const BUCKET = "services";

async function ensureBucket(supabase: NonNullable<ReturnType<typeof createAdminSupabase>>) {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
  }
}

export async function uploadServiceImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    throw new Error("Dosya seçilmedi.");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Dosya boyutu 5MB'dan büyük olamaz.");
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    throw new Error("Sadece JPEG, PNG, WebP ve GIF formatları desteklenir.");
  }

  const supabase = createAdminSupabase();
  if (!supabase) throw new Error("Supabase is not configured");
  await ensureBucket(supabase);

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `images/${fileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Yükleme hatası: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function deleteServiceImage(url: string): Promise<void> {
  const supabase = createAdminSupabase();
  if (!supabase) return;

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  if (!url.startsWith(bucketUrl)) return;

  const path = url.replace(bucketUrl, "");
  await supabase.storage.from(BUCKET).remove([path]);
}
