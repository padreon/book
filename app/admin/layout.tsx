import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Login page uses its own layout
    if (!user) {
        return <>{children}</>;
    }

    // Get user profile for role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/admin/login");
    }

    // Get dynamic logo
    const { data: logoSetting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "logo_url")
        .single();

    return (
        <div className="flex min-h-screen bg-cream">
            <AdminSidebar role={profile.role} email={profile.email} logoUrl={logoSetting?.value || ""} />
            <div className="flex-1 ml-0 md:ml-64">
                <div className="p-6 md:p-8">{children}</div>
            </div>
        </div>
    );
}
