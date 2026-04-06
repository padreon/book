import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
    const supabase = await createClient();

    // Verify master_admin
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");

    const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (currentProfile?.role !== "master_admin") {
        redirect("/admin/dashboard");
    }

    // Fetch all settings
    const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value");

    const settingsMap: Record<string, string> = {};
    settings?.forEach((s) => {
        settingsMap[s.key] = s.value || "";
    });

    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Pengaturan Website</h1>
            <SettingsForm settings={settingsMap} />
        </div>
    );
}
