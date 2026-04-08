"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient();
    const headersList = await headers();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "Semua kolom wajib diisi." };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Format email tidak valid." };
    }

    // Get IP for rate limiting
    const ip =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "unknown";

    // Rate limiting: max 3 per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", ip)
        .gte("created_at", oneHourAgo);

    if (count !== null && count >= 3) {
        return {
            error:
                "Terlalu banyak pesan. Silakan coba lagi dalam satu jam.",
        };
    }

    const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        message,
        ip_address: ip,
    });

    if (error) {
        return { error: "Gagal mengirim pesan. Silakan coba lagi." };
    }

    return { success: true };
}

export async function markMessageAsRead(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", id);

    if (error) {
        return { error: "Gagal memperbarui status." };
    }

    revalidatePath("/admin/messages");
    return { success: true };
}

export async function deleteMessage(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

    if (error) {
        return { error: "Gagal menghapus pesan." };
    }

    revalidatePath("/admin/messages");
    return { success: true };
}
