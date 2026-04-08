"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    if (!password || password.length < 6) {
        return { error: "Password minimal 6 karakter." };
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function generate2FASecret() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Tidak terautentikasi" };

    const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single();

    const { Secret, TOTP } = await import("otpauth");

    const secret = new Secret();
    const totp = new TOTP({
        issuer: "Banua Publisher",
        label: profile?.email || user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret
    });

    // Provide base32 representation for manual setup
    return {
        base32: secret.base32,
        uri: totp.toString()
    };
}

export async function enable2FA(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Tidak terautentikasi" };

    const secretBase32 = formData.get("secret") as string;
    const token = formData.get("token") as string;

    if (!secretBase32 || !token) {
        return { error: "Form tidak lengkap." };
    }

    const { TOTP } = await import("otpauth");
    const totp = new TOTP({
        secret: secretBase32,
        algorithm: "SHA1",
        digits: 6,
        period: 30
    });

    const isValid = totp.validate({ token, window: 1 }) !== null;
    if (!isValid) {
        return { error: "Kode 2FA tidak valid. Pastikan waktu di HP Anda sudah sinkron." };
    }

    const { error } = await supabase.from("profiles").update({ totp_secret: secretBase32 }).eq("id", user.id);

    if (error) {
        return { error: "Gagal menyimpan rahasia 2FA ke database." };
    }

    revalidatePath("/admin/profile");
    return { success: true };
}

export async function disable2FA() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Tidak terautentikasi" };

    const { error } = await supabase.from("profiles").update({ totp_secret: null }).eq("id", user.id);

    if (error) {
        return { error: "Gagal menonaktifkan 2FA." };
    }

    revalidatePath("/admin/profile");
    return { success: true };
}
