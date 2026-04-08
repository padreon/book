import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileManager } from "./ProfileManager";

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/admin/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("email, role, totp_secret")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/admin/login");
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl mb-8">Profil Saya</h1>

            <div className="bg-white border border-border-light p-6 mb-8 max-w-2xl">
                <h2 className="text-lg font-semibold mb-2">Detail Akun</h2>
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                        <span className="text-text-muted block">Email</span>
                        <span className="font-semibold">{profile.email}</span>
                    </div>
                    <div>
                        <span className="text-text-muted block">Peran Admin</span>
                        <span className="font-semibold capitalize">{profile.role.replace("_", " ")}</span>
                    </div>
                </div>
            </div>

            <ProfileManager
                has2FA={!!profile.totp_secret}
            />
        </div>
    );
}
