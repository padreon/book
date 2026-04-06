"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export async function createPage(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const content = (formData.get("content") as string) || "";
    const is_published = formData.get("is_published") === "true";

    if (!title) {
        return { error: "Judul wajib diisi." };
    }

    const { error } = await supabase.from("pages").insert({
        title,
        slug,
        content,
        is_published,
    });

    if (error) {
        if (error.code === "23505") {
            return { error: "Slug sudah digunakan." };
        }
        return { error: "Gagal menyimpan halaman." };
    }

    revalidatePath("/admin/pages");
    redirect("/admin/pages");
}

export async function updatePage(id: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = (formData.get("content") as string) || "";
    const is_published = formData.get("is_published") === "true";

    if (!title) {
        return { error: "Judul wajib diisi." };
    }

    const { error } = await supabase
        .from("pages")
        .update({ title, slug, content, is_published })
        .eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return { error: "Slug sudah digunakan." };
        }
        return { error: "Gagal memperbarui halaman." };
    }

    revalidatePath("/admin/pages");
    revalidatePath(`/${slug}`);
    redirect("/admin/pages");
}

export async function deletePage(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("pages").delete().eq("id", id);

    if (error) {
        return { error: "Gagal menghapus halaman." };
    }

    revalidatePath("/admin/pages");
    return { success: true };
}

export async function togglePagePublish(id: string, is_published: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("pages")
        .update({ is_published })
        .eq("id", id);

    if (error) {
        return { error: "Gagal mengubah status." };
    }

    revalidatePath("/admin/pages");
    return { success: true };
}
