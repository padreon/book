"use client";

import { useState, useEffect } from "react";
import { login, verify2FA, hasAnyAdmin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [requires2FA, setRequires2FA] = useState(false);
    const [userId, setUserId] = useState("");
    const [totpCode, setTotpCode] = useState("");

    useEffect(() => {
        hasAnyAdmin().then((exists) => {
            if (!exists) {
                router.replace("/admin/setup");
            } else {
                setChecking(false);
            }
        });
    }, [router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else if (result?.requires2FA) {
            setRequires2FA(true);
            setUserId(result.userId);
            setLoading(false);
        }
    };

    const handle2FA = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await verify2FA(userId, totpCode);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-gold flex items-center justify-center mx-auto mb-4">
                        <span className="text-navy font-heading font-bold text-lg">B</span>
                    </div>
                    <h1 className="text-2xl text-white mb-1">Masuk</h1>
                    <p className="text-white/50 text-sm">Banua Publisher Admin</p>
                </div>

                {!requires2FA ? (
                    <form onSubmit={handleLogin} className="space-y-4">
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
                                className="input bg-navy-light border-white/10 text-white placeholder-white/30 focus:border-gold"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full"
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handle2FA} className="space-y-4">
                        <p className="text-white/70 text-sm text-center mb-4">
                            Masukkan kode 2FA dari aplikasi autentikator Anda.
                        </p>
                        <div>
                            <label
                                htmlFor="totp"
                                className="block text-sm text-white/70 mb-1"
                            >
                                Kode 2FA
                            </label>
                            <input
                                type="text"
                                id="totp"
                                value={totpCode}
                                onChange={(e) => setTotpCode(e.target.value)}
                                maxLength={6}
                                pattern="[0-9]{6}"
                                required
                                className="input bg-navy-light border-white/10 text-white text-center text-2xl tracking-[0.5em] placeholder-white/30 focus:border-gold"
                                placeholder="000000"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full"
                        >
                            {loading ? "Memverifikasi..." : "Verifikasi"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setRequires2FA(false);
                                setError("");
                            }}
                            className="w-full text-sm text-white/40 hover:text-white/60"
                        >
                            ← Kembali ke login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
