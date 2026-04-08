"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteTiptapImage } from "@/app/actions/tiptap";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export async function uploadBookImage(formData: FormData) {
    const serviceClient = await createServiceClient();
    const file = formData.get("file") as File;

    if (!file) return { error: "File tidak ditemukan." };

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
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

    const { data: book } = await supabase.from("books").select("cover_url, images").eq("id", id).single();
    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) {
        return { error: "Gagal menghapus buku." };
    }

    if (book) {
        if (book.cover_url) {
            await deleteTiptapImage(book.cover_url).catch(console.error);
        }
        if (book.images && Array.isArray(book.images)) {
            for (const imgUrl of book.images) {
                await deleteTiptapImage(imgUrl).catch(console.error);
            }
        }
    }

    revalidatePath("/books");
    revalidatePath("/");
    revalidatePath("/admin/books");
    return { success: true };
}
