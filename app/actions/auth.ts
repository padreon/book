"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email dan password wajib diisi." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { error: "Email atau password salah." };
    }

    // Check if user has a profile with admin/master_admin role
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Gagal mendapatkan data pengguna." };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, totp_secret")
        .eq("id", user.id)
        .single();

    if (!profile) {
        await supabase.auth.signOut();
        return { error: "Akun tidak memiliki akses admin." };
    }

    // If master_admin with TOTP, require 2FA
    if (profile.role === "master_admin" && profile.totp_secret) {
        return { requires2FA: true, userId: user.id };
    }

    revalidatePath("/admin", "layout");
    redirect("/admin/dashboard");
}

export async function verify2FA(userId: string, token: string) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("totp_secret")
        .eq("id", userId)
        .single();

    if (!profile?.totp_secret) {
        return { error: "2FA tidak dikonfigurasi." };
    }

    // Verify TOTP using otpauth
    const { TOTP } = await import("otpauth");
    const totp = new TOTP({
        secret: profile.totp_secret,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
    });

    const isValid = totp.validate({ token, window: 1 }) !== null;

    if (!isValid) {
        return { error: "Kode 2FA tidak valid." };
    }

    revalidatePath("/admin", "layout");
    redirect("/admin/dashboard");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
}

export async function createAdminAccount(formData: FormData) {
    const supabase = await createClient();
    const serviceClient = await createServiceClient();

    // Verify current user is master_admin
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Tidak terautentikasi." };

    const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (currentProfile?.role !== "master_admin") {
        return { error: "Hanya master admin yang dapat menambahkan akun." };
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email dan password wajib diisi." };
    }

    // Create user via service role client
    const { data: newUser, error: createError } =
        await serviceClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

    if (createError || !newUser.user) {
        return { error: createError?.message || "Gagal membuat akun." };
    }

    // Create profile
    const { error: profileError } = await serviceClient
        .from("profiles")
        .insert({ id: newUser.user.id, email, role: "admin" });

    if (profileError) {
        return { error: "Akun dibuat tapi gagal menyimpan profil." };
    }

    revalidatePath("/admin/accounts");
    return { success: true };
}

export async function deleteAdminAccount(accountId: string) {
    const supabase = await createClient();
    const serviceClient = await createServiceClient();

    // Verify current user is master_admin
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Tidak terautentikasi." };

    const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (currentProfile?.role !== "master_admin") {
        return { error: "Hanya master admin yang dapat menghapus akun." };
    }

    // Cannot delete self
    if (accountId === user.id) {
        return { error: "Tidak dapat menghapus akun sendiri." };
    }

    await serviceClient.auth.admin.deleteUser(accountId);
    await serviceClient.from("profiles").delete().eq("id", accountId);

    revalidatePath("/admin/accounts");
    return { success: true };
}
