"use server";

import { createServiceClient } from "@/lib/supabase/server";

export async function uploadTiptapImage(formData: FormData) {
    const serviceClient = await createServiceClient();
    const file = formData.get("file") as File;

    if (!file) return { error: "File tidak ditemukan." };

    const filename = `tiptap-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await serviceClient.storage
        .from("media")
        .upload(filename, file);

    if (error) {
        return { error: error.message };
    }

    const {
        data: { publicUrl },
    } = serviceClient.storage.from("media").getPublicUrl(filename);

    return { url: publicUrl, filename };
}

export async function deleteTiptapImage(url: string) {
    const serviceClient = await createServiceClient();
    
    // Extract filename from the Supabase storage public URL
    // Format is usually: .../storage/v1/object/public/media/[filename]
    try {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];

        if (!filename) {
            return { error: "Invalid URL structure." };
        }

        const { error } = await serviceClient.storage
            .from("media")
            .remove([filename]);

        if (error) {
            console.error("Failed to delete tiptap image:", error);
            return { error: error.message };
        }

        return { success: true };
    } catch (e) {
        return { error: "Failed to parse URL." };
    }
}
