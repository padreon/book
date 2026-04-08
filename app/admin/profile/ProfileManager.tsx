"use client";

import { useState } from "react";
import { updatePassword, generate2FASecret, enable2FA, disable2FA } from "@/app/actions/profile";

export function ProfileManager({ has2FA }: { has2FA: boolean }) {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordTotp, setPasswordTotp] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [setup2FA, setSetup2FA] = useState<{ base32: string; uri: string } | null>(null);
    const [totpToken, setTotpToken] = useState("");
    const [twoFAError, setTwoFAError] = useState("");
    const [twoFALoading, setTwoFALoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (password !== passwordConfirm) {
            setPasswordError("Konfirmasi password tidak cocok.");
            return;
        }

        setPasswordLoading(true);
        const formData = new FormData();
        formData.set("password", password);
        if (has2FA) {
            formData.set("token", passwordTotp);
        }

        const result = await updatePassword(formData);

        if (result.error) {
            setPasswordError(result.error);
        } else {
            setPasswordSuccess("Password berhasil diubah.");
            setPassword("");
            setPasswordConfirm("");
            setPasswordTotp("");
        }
        setPasswordLoading(false);
    };

    const handleInit2FA = async () => {
        setTwoFALoading(true);
        const result = await generate2FASecret();
        if (result.base32 && result.uri) {
            setSetup2FA({ base32: result.base32, uri: result.uri });
        } else if (result.error) {
            setTwoFAError(result.error);
        }
        setTwoFALoading(false);
    };

    const handleEnable2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!setup2FA) return;

        setTwoFALoading(true);
        setTwoFAError("");

        const formData = new FormData();
        formData.set("secret", setup2FA.base32);
        formData.set("token", totpToken);

        const result = await enable2FA(formData);

        if (result.error) {
            setTwoFAError(result.error);
            setTwoFALoading(false);
        } else {
            setSetup2FA(null);
            setTotpToken("");
            setTwoFALoading(false);
        }
    };

    const handleDisable2FA = async () => {
        const token = prompt("Masukkan kode 2FA untuk menonaktifkan:");
        if (!token) return;
        setTwoFALoading(true);
        const result = await disable2FA(token);
        if (result.error) setTwoFAError(result.error);
        setTwoFALoading(false);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Password Section */}
            <div className="bg-white border border-border-light p-6">
                <h2 className="text-xl mb-4">Ubah Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Password Baru</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                            className="input"
                            placeholder="Min. 6 karakter"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            minLength={6}
                            required
                            className="input"
                        />
                    </div>

                    {has2FA && (
                        <div>
                            <label className="block text-sm font-semibold mb-1">Kode 2FA</label>
                            <input
                                type="text"
                                value={passwordTotp}
                                onChange={(e) => setPasswordTotp(e.target.value)}
                                maxLength={6}
                                pattern="[0-9]{6}"
                                required
                                className="input tracking-widest text-lg text-center"
                                placeholder="000000"
                            />
                        </div>
                    )}

                    {passwordError && <p className="text-error text-sm">{passwordError}</p>}
                    {passwordSuccess && <p className="text-success text-sm font-semibold">{passwordSuccess}</p>}

                    <button type="submit" disabled={passwordLoading} className="btn-primary">
                        {passwordLoading ? "Memproses..." : "Update Password"}
                    </button>
                </form>
            </div>

            {/* 2FA Section */}
            <div className="bg-white border border-border-light p-6">
                <h2 className="text-xl mb-2">Autentikasi 2 Langkah (2FA)</h2>
                <p className="text-sm text-text-muted mb-6">Tambahkan lapisan keamanan saat Login dengan aplikasi seperti Google Authenticator.</p>

                {twoFAError && <p className="text-error text-sm mb-4">{twoFAError}</p>}

                {has2FA ? (
                    <div>
                        <p className="text-success font-semibold text-sm mb-4">✓ 2FA Aktif</p>
                        <button
                            onClick={handleDisable2FA}
                            disabled={twoFALoading}
                            className="btn-secondary text-error border-error/20 hover:border-error"
                        >
                            {twoFALoading ? "Memproses..." : "Nonaktifkan 2FA"}
                        </button>
                    </div>
                ) : !setup2FA ? (
                    <div>
                        <button
                            onClick={handleInit2FA}
                            disabled={twoFALoading}
                            className="btn-primary"
                        >
                            {twoFALoading ? "Menyiapkan..." : "Aktifkan 2FA"}
                        </button>
                        {twoFAError && <p className="text-error text-sm mt-3">{twoFAError}</p>}
                    </div>
                ) : (
                    <div className="p-4 border border-gold/30 bg-cream-light rounded">
                        <h3 className="font-semibold mb-3">Langkah Setup 2FA</h3>
                        <ol className="list-decimal pl-4 text-sm space-y-4 mb-6">
                            <li>Buka aplikasi Autentikator di HP Anda (contoh: Google Authenticator).</li>
                            <li>Pilih opsi "Manual Entry" atau "Masukkan Kunci Setup".</li>
                            <li>
                                Masukkan kode kunci di bawah ini:<br />
                                <code className="block mt-2 p-2 bg-black/5 rounded text-lg tracking-widest font-mono text-center">
                                    {setup2FA.base32}
                                </code>
                            </li>
                            <li>Masukkan 6 digit kode yang dihasilkan aplikasi untuk memverifikasi.</li>
                        </ol>

                        <form onSubmit={handleEnable2FA} className="max-w-xs space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Kode Verifikasi (6 digit)</label>
                                <input
                                    type="text"
                                    value={totpToken}
                                    onChange={(e) => setTotpToken(e.target.value)}
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    required
                                    className="input text-center text-xl tracking-[0.3em]"
                                    placeholder="000000"
                                />
                            </div>

                            {twoFAError && <p className="text-error text-sm">{twoFAError}</p>}

                            <div className="flex gap-2">
                                <button type="submit" disabled={twoFALoading} className="btn-primary flex-1">
                                    {twoFALoading ? "Memverifikasi..." : "Verifikasi"}
                                </button>
                                <button type="button" onClick={() => { setSetup2FA(null); setTwoFAError(""); }} className="btn-secondary">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
