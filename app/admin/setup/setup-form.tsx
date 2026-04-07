"use client";

import { useState } from "react";
import { setupMasterAdmin } from "@/app/actions/auth";

export default function SetupForm() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSetup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await setupMasterAdmin(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-gold flex items-center justify-center mx-auto mb-4">
                        <span className="text-navy font-heading font-bold text-lg">B</span>
                    </div>
                    <h1 className="text-2xl text-white mb-1">Setup Awal</h1>
                    <p className="text-white/50 text-sm">
                        Buat akun Master Admin pertama
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                    <p className="text-white/60 text-xs leading-relaxed">
                        👋 Selamat datang! Belum ada admin yang terdaftar. Akun pertama
                        yang dibuat akan otomatis menjadi <strong className="text-gold">Master Admin</strong> dengan
                        akses penuh ke seluruh sistem.
                    </p>
                </div>

                <form onSubmit={handleSetup} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm text-white/70 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="input bg-navy-light border-white/10 text-white placeholder-white/30 focus:border-gold"
                            placeholder="admin@banuapublisher.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm text-white/70 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            minLength={6}
                            className="input bg-navy-light border-white/10 text-white placeholder-white/30 focus:border-gold"
                            placeholder="Minimal 6 karakter"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold w-full"
                    >
                        {loading ? "Memproses..." : "Buat Akun Master Admin"}
                    </button>
                </form>
            </div>
        </div>
    );
}
