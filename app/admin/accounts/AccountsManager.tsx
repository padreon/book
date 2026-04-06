"use client";

import { useState } from "react";
import { createAdminAccount, deleteAdminAccount } from "@/app/actions/auth";

type Account = {
    id: string;
    email: string;
    role: string;
    created_at: string;
};

export function AccountsManager({
    accounts,
    currentUserId,
}: {
    accounts: Account[];
    currentUserId: string;
}) {
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.set("email", email);
        formData.set("password", password);

        const result = await createAdminAccount(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setEmail("");
            setPassword("");
            setShowForm(false);
            window.location.reload();
        }
        setLoading(false);
    };

    const handleDelete = async (accountId: string) => {
        if (!confirm("Yakin ingin menghapus akun ini?")) return;
        const result = await deleteAdminAccount(accountId);
        if (result?.error) {
            alert(result.error);
        } else {
            window.location.reload();
        }
    };

    return (
        <div>
            {/* Add Admin Button */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary text-sm mb-6"
            >
                {showForm ? "Batal" : "+ Tambah Admin"}
            </button>

            {/* Create Admin Form */}
            {showForm && (
                <form
                    onSubmit={handleCreate}
                    className="bg-white border border-border-light p-6 mb-6 max-w-md space-y-4"
                >
                    <div>
                        <label className="block text-sm font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="input"
                        />
                    </div>
                    {error && <p className="text-error text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Membuat..." : "Buat Akun"}
                    </button>
                </form>
            )}

            {/* Accounts List */}
            <div className="bg-white border border-border-light overflow-x-auto">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Dibuat</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td className="font-semibold text-text-primary">
                                    {account.email}
                                </td>
                                <td>
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 ${account.role === "master_admin"
                                                ? "bg-gold/20 text-gold-dark"
                                                : "bg-navy/10 text-navy"
                                            }`}
                                    >
                                        {account.role.replace("_", " ")}
                                    </span>
                                </td>
                                <td className="text-text-muted">
                                    {new Date(account.created_at).toLocaleDateString("id-ID")}
                                </td>
                                <td className="text-right">
                                    {account.id !== currentUserId &&
                                        account.role !== "master_admin" && (
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="text-sm text-error/70 hover:text-error transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
