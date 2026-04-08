"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadSiteMedia(formData: FormData) {
    const serviceClient = await createServiceClient();
    const file = formData.get("file") as File;

    if (!file) return { error: "File tidak ditemukan." };

    const filename = `site-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await serviceClient.storage
        .from("media")
        .upload(filename, file);

    if (error) {
        return { error: error.message };
    }

    const {
        data: { publicUrl },
    } = serviceClient.storage.from("media").getPublicUrl(filename);

    return { url: publicUrl };
}

export async function updateSettings(formData: FormData) {
    const supabase = await createClient();

    // Verify master_admin
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Tidak terautentikasi." };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "master_admin") {
        return { error: "Hanya master admin yang dapat mengubah pengaturan." };
    }

    const keys = [
        "publisher_name",
        "tagline",
        "hero_description",
        "about_description",
        "address",
        "email",
        "phone",
        "whatsapp_number",
        "instagram_url",
        "twitter_url",
        "facebook_url",
        "youtube_url",
        "tiktok_url",
        "google_analytics_id",
        "footer_text",
        "meta_description",
        "logo_url",
        "favicon_url",
    ];

    const updates = keys
        .map((key) => ({
            key,
            value: (formData.get(key) as string) || "",
        }))
        .filter((item) => item.value !== undefined);

    for (const update of updates) {
        await supabase
            .from("site_settings")
            .upsert(
                { key: update.key, value: update.value },
                { onConflict: "key" }
            );
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true };
}
