"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Service, ServiceInsert, ServiceUpdate } from "@/types/service";

export async function getServices(): Promise<Service[]> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Service[];
}

export async function getActiveServices(): Promise<Service[]> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Service[];
}

export async function getMainService(): Promise<Service | null> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .eq("is_main_service", true)
    .single();

  if (error || !data) return null;
  return data as Service;
}

export async function getRegularServices(): Promise<Service[]> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .or("is_main_service.is.null,is_main_service.eq.false")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Service[];
}

export async function getServiceBySlug(
  slug: string
): Promise<Service | null> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Service;
}

export async function createService(
  service: ServiceInsert
): Promise<Service> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  return data as Service;
}

export async function updateService(
  id: string,
  updates: ServiceUpdate
): Promise<Service> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  revalidatePath(`/hizmetler/${data.slug}`);
  return data as Service;
}

export async function deleteService(id: string): Promise<void> {
  const supabase = createAdminSupabase();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
}

export async function getRelatedServices(
  slug: string,
  count = 3
): Promise<Service[]> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .neq("slug", slug)
    .order("sort_order", { ascending: true })
    .limit(count);

  if (error) return [];
  return data as Service[];
}

export async function toggleServiceActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
}
