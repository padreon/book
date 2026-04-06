"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        const form = e.currentTarget;
        const formData = new FormData(form);
        const result = await submitContactForm(formData);

        if (result.error) {
            setStatus("error");
            setErrorMessage(result.error);
        } else {
            setStatus("success");
            form.reset();
        }
    };

    return (
        <>
            {/* Page Header */}
            <section className="bg-navy">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                        Hubungi Kami
                    </span>
                    <h1 className="text-3xl md:text-4xl text-white mt-2">Kontak</h1>
                </div>
                <div className="divider-gold" />
            </section>

            {/* Contact Form */}
            <section className="max-w-2xl mx-auto px-6 py-16">
                <p className="text-text-secondary mb-8 leading-relaxed">
                    Punya pertanyaan, saran, atau ingin berkolaborasi? Silakan hubungi
                    kami melalui formulir di bawah ini.
                </p>

                {status === "success" ? (
                    <div className="bg-success/10 border border-success/30 p-6 text-center">
                        <p className="text-success font-semibold">
                            Pesan Anda berhasil dikirim!
                        </p>
                        <p className="text-text-secondary text-sm mt-2">
                            Kami akan merespons sesegera mungkin.
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="btn-secondary mt-4 text-sm"
                        >
                            Kirim Pesan Lagi
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold text-text-primary mb-2"
                            >
                                Nama
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="input"
                                placeholder="Nama lengkap Anda"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-text-primary mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="input"
                                placeholder="email@contoh.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-semibold text-text-primary mb-2"
                            >
                                Pesan
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="textarea"
                                placeholder="Tulis pesan Anda..."
                                rows={5}
                            />
                        </div>

                        {status === "error" && (
                            <p className="text-error text-sm">{errorMessage}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="btn-primary w-full"
                        >
                            {status === "loading" ? "Mengirim..." : "Kirim Pesan"}
                        </button>
                    </form>
                )}
            </section>
        </>
    );
}
