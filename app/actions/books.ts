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

export async function createBook(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const editor = (formData.get("editor") as string) || null;
    const synopsis = formData.get("synopsis") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const cover_url = (formData.get("cover_url") as string) || null;
    const imagesRaw = formData.get("images") as string;
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    if (!title || !author || !synopsis) {
        return { error: "Judul, penulis, dan sinopsis wajib diisi." };
    }

    const { error } = await supabase.from("books").insert({
        title,
        slug,
        author,
        editor,
        synopsis,
        cover_url,
        images,
    });

    if (error) {
        if (error.code === "23505") {
            return { error: "Slug sudah digunakan. Gunakan slug yang berbeda." };
        }
        return { error: "Gagal menyimpan buku." };
    }

    revalidatePath("/books");
    revalidatePath("/");
    revalidatePath("/admin/books");
    redirect("/admin/books");
}

export async function updateBook(id: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const editor = (formData.get("editor") as string) || null;
    const synopsis = formData.get("synopsis") as string;
    const slug = formData.get("slug") as string;
    const cover_url = (formData.get("cover_url") as string) || null;
    const imagesRaw = formData.get("images") as string;
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    if (!title || !author || !synopsis) {
        return { error: "Judul, penulis, dan sinopsis wajib diisi." };
    }

    const { error } = await supabase
        .from("books")
        .update({ title, slug, author, editor, synopsis, cover_url, images })
        .eq("id", id);

    if (error) {
        if (error.code === "23505") {
            return { error: "Slug sudah digunakan." };
        }
        return { error: "Gagal memperbarui buku." };
    }

    revalidatePath("/books");
    revalidatePath(`/books/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/books");
    redirect("/admin/books");
}

export async function deleteBook(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) {
        return { error: "Gagal menghapus buku." };
    }

    revalidatePath("/books");
    revalidatePath("/");
    revalidatePath("/admin/books");
    return { success: true };
}
