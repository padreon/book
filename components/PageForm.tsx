"use client";

import { useState } from "react";
import { TiptapEditor } from "./TiptapEditor";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

type PageFormProps = {
    action: (formData: FormData) => Promise<{ error?: string } | void>;
    initialData?: {
        title: string;
        slug: string;
        content: string;
        is_published: boolean;
    };
};

export function PageForm({ action, initialData }: PageFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [isPublished, setIsPublished] = useState(
        initialData?.is_published || false
    );
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!initialData) {
            setSlug(slugify(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.set("title", title);
        formData.set("slug", slug);
        formData.set("content", content);
        formData.set("is_published", String(isPublished));

        const result = await action(formData);
        if (result?.error) {
            setError(result.error);
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <div>
                <label className="block text-sm font-semibold mb-2">Judul *</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="input"
                    placeholder="Judul halaman"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Slug</label>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input"
                    placeholder="judul-halaman"
                />
                <p className="text-xs text-text-muted mt-1">URL: /{slug || "..."}</p>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Konten</label>
                <p className="text-xs text-text-muted mb-2">
                    Gunakan editor di bawah ini untuk memformat teks.
                </p>
                <TiptapEditor
                    content={content}
                    onChange={(value) => setContent(value)}
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="is_published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 accent-gold"
                />
                <label htmlFor="is_published" className="text-sm font-semibold">
                    Terbitkan halaman
                </label>
            </div>

            {error && <p className="text-error text-sm">{error}</p>}

            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                >
                    {submitting ? "Menyimpan..." : "Simpan"}
                </button>
                <a href="/admin/pages" className="btn-secondary">
                    Batal
                </a>
            </div>
        </form>
    );
}
