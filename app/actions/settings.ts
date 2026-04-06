"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
