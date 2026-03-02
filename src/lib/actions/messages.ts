"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export async function getMessages(): Promise<Message[]> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Message[];
}

export async function markMessageRead(id: string): Promise<void> {
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/mesajlar");
}

export async function createMessage(params: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const supabase = createAdminSupabase();
  const { error } = await supabase.from("messages").insert({
    name: params.name,
    email: params.email,
    phone: params.phone || null,
    subject: params.subject || null,
    message: params.message,
  });

  if (error) throw new Error(error.message);
}
