import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountsManager } from "./AccountsManager";

export const revalidate = 0;

export default async function AdminAccountsPage() {
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

    // Fetch all admin accounts
    const { data: accounts } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });

    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Akun Admin</h1>
            <AccountsManager
                accounts={accounts || []}
                currentUserId={user.id}
            />
        </div>
    );
}
