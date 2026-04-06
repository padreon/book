"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

type BookFormProps = {
    action: (formData: FormData) => Promise<{ error?: string } | void>;
    initialData?: {
        title: string;
        slug: string;
        author: string;
        editor: string | null;
        synopsis: string;
        cover_url: string | null;
        images: string[];
    };
};

export function BookForm({ action, initialData }: BookFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [author, setAuthor] = useState(initialData?.author || "");
    const [editor, setEditor] = useState(initialData?.editor || "");
    const [synopsis, setSynopsis] = useState(initialData?.synopsis || "");
    const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || "");
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!initialData) {
            setSlug(slugify(value));
        }
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        const supabase = createClient();
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error } = await supabase.storage
            .from("media")
            .upload(filename, file);

        if (error) {
            console.error("Upload error:", error);
            return null;
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("media").getPublicUrl(filename);

        return publicUrl;
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const url = await uploadFile(file);
        if (url) setCoverUrl(url);
        setUploading(false);
    };

    const handleImagesUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const newUrls: string[] = [];
        for (const file of Array.from(files)) {
            const url = await uploadFile(file);
            if (url) newUrls.push(url);
        }
        setImages((prev) => [...prev, ...newUrls]);
        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.set("title", title);
        formData.set("slug", slug);
        formData.set("author", author);
        formData.set("editor", editor);
        formData.set("synopsis", synopsis);
        formData.set("cover_url", coverUrl);
        formData.set("images", JSON.stringify(images));

        const result = await action(formData);
        if (result?.error) {
            setError(result.error);
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <div>
                <label className="block text-sm font-semibold mb-2">Judul *</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="input"
                    placeholder="Judul buku"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Slug</label>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input"
                    placeholder="judul-buku"
                />
                <p className="text-xs text-text-muted mt-1">
                    URL: /books/{slug || "..."}
                </p>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Penulis *</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="input"
                    placeholder="Nama penulis"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">
                    Editor (opsional)
                </label>
                <input
                    type="text"
                    value={editor}
                    onChange={(e) => setEditor(e.target.value)}
                    className="input"
                    placeholder="Nama editor"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Sinopsis *</label>
                <textarea
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    required
                    className="textarea"
                    placeholder="Tulis sinopsis buku..."
                    rows={6}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">
                    Gambar Sampul
                </label>
                {coverUrl && (
                    <div className="mb-3">
                        <img
                            src={coverUrl}
                            alt="Cover preview"
                            className="w-32 h-auto border border-border-light"
                        />
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploading}
                    className="text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">
                    Gambar Tambahan
                </label>
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {images.map((url, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={url}
                                    alt={`Image ${i + 1}`}
                                    className="w-20 h-20 object-cover border border-border-light"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white text-xs flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    disabled={uploading}
                    className="text-sm"
                />
            </div>

            {uploading && (
                <p className="text-sm text-text-muted">Mengunggah gambar...</p>
            )}

            {error && <p className="text-error text-sm">{error}</p>}

            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="btn-primary"
                >
                    {submitting ? "Menyimpan..." : "Simpan"}
                </button>
                <a href="/admin/books" className="btn-secondary">
                    Batal
                </a>
            </div>
        </form>
    );
}
