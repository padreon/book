"use client";

import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";

const settingGroups = [
    {
        title: "Informasi Penerbit",
        fields: [
            { key: "publisher_name", label: "Nama Penerbit" },
            { key: "tagline", label: "Tagline" },
            { key: "hero_description", label: "Deskripsi Hero Utama" },
            { key: "about_description", label: "Deskripsi Tentang Kami" },
            { key: "meta_description", label: "Deskripsi Meta" },
            { key: "address", label: "Alamat" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Telepon" },
            { key: "whatsapp_number", label: "WhatsApp" },
        ],
    },
    {
        title: "Media Sosial",
        fields: [
            { key: "instagram_url", label: "Instagram URL" },
            { key: "twitter_url", label: "Twitter URL" },
            { key: "facebook_url", label: "Facebook URL" },
            { key: "youtube_url", label: "YouTube URL" },
            { key: "tiktok_url", label: "TikTok URL" },
        ],
    },
    {
        title: "Lainnya",
        fields: [
            { key: "google_analytics_id", label: "Google Analytics ID (GA4)" },
            { key: "footer_text", label: "Teks Footer" },
            { key: "logo_url", label: "Logo URL" },
            { key: "favicon_url", label: "Favicon URL" },
        ],
    },
];

export function SettingsForm({
    settings,
}: {
    settings: Record<string, string>;
}) {
    const [values, setValues] = useState(settings);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (key: string, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.set(key, value);
        });

        const result = await updateSettings(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setSaved(true);
        }
        setSaving(false);
    };

    const handleImageUpload = async (key: string, file?: File) => {
        if (!file) return;
        setSaving(true);
        setError("");

        try {
            let processedFile = file;
            if (key === "favicon_url") {
                const imageCompression = (await import("browser-image-compression")).default;
                processedFile = await imageCompression(file, {
                    maxSizeMB: 0.1, // 100kb
                    maxWidthOrHeight: 256,
                    useWebWorker: true,
                });
            }

            const formData = new FormData();
            formData.append("file", processedFile);

            const { uploadSiteMedia } = await import("@/app/actions/settings");
            const result = await uploadSiteMedia(formData);

            if (result?.error) {
                setError(result.error);
            } else if (result?.url) {
                setValues((prev) => ({ ...prev, [key]: result.url }));
                setSaved(false);
            }
        } catch (err: any) {
            setError("Gagal mengunggah gambar.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-10">
            {settingGroups.map((group) => (
                <div key={group.title}>
                    <h2 className="text-xl mb-4">{group.title}</h2>
                    <div className="space-y-4">
                        {group.fields.map((field) => (
                            <div key={field.key}>
                                <label className="block text-sm font-semibold mb-1">
                                    {field.label}
                                </label>
                                {field.key === "logo_url" || field.key === "favicon_url" ? (
                                    <div className="space-y-3">
                                        {values[field.key] && (
                                            <div className="relative w-16 h-16 border border-border-light rounded bg-white overflow-hidden p-1 shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={values[field.key]} alt={field.label} className="object-contain w-full h-full" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(field.key, e.target.files?.[0])}
                                            className="block w-full text-sm text-text-muted
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-gold file:text-navy
                                                hover:file:bg-gold-light cursor-pointer transition-colors"
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={values[field.key] || ""}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="input"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="divider-gold w-24 mt-6" />
                </div>
            ))}

            {error && <p className="text-error text-sm">{error}</p>}
            {saved && (
                <p className="text-success text-sm font-semibold">
                    ✓ Pengaturan berhasil disimpan.
                </p>
            )}

            <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
        </form>
    );
}
