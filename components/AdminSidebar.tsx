"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { useState } from "react";

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/books", label: "Buku", icon: "📚" },
    { href: "/admin/pages", label: "Halaman", icon: "📄" },
    { href: "/admin/messages", label: "Pesan", icon: "✉️" },
    { href: "/admin/profile", label: "Profil Saya", icon: "🔑" },
];

const masterAdminItems = [
    { href: "/admin/accounts", label: "Akun Admin", icon: "👤" },
    { href: "/admin/settings", label: "Pengaturan", icon: "⚙️" },
];

export function AdminSidebar({
    role,
    email,
    logoUrl,
}: {
    role: string;
    email: string;
    logoUrl?: string;
}) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const allItems =
        role === "master_admin" ? [...navItems, ...masterAdminItems] : navItems;

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-navy text-white p-2 rounded-sm"
                aria-label="Toggle admin menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    {mobileOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                        />
                    )}
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-dark flex flex-col transform transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/10">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3"
                        onClick={() => setMobileOpen(false)}
                    >
                        {logoUrl ? (
                            <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-white p-0.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={logoUrl} alt="Admin Logo" className="object-contain w-full h-full" />
                            </div>
                        ) : (
                            <div className="w-7 h-7 bg-gold flex items-center justify-center">
                                <span className="text-navy text-xs font-bold">B</span>
                            </div>
                        )}
                        <span className="font-heading text-sm font-bold text-white">
                            Admin Panel
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {allItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`admin-sidebar-link ${pathname.startsWith(item.href) ? "active" : ""
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="px-4 py-4 border-t border-white/10">
                    <p className="text-xs text-white/40 truncate mb-2">{email}</p>
                    <p className="text-xs text-gold/70 mb-3 capitalize">{role.replace("_", " ")}</p>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full text-left text-sm text-white/50 hover:text-white transition-colors"
                        >
                            Keluar →
                        </button>
                    </form>
                </div>

                {/* Back to Site */}
                <div className="px-4 pb-4">
                    <Link
                        href="/"
                        className="text-xs text-white/30 hover:text-white/50 transition-colors"
                    >
                        ← Lihat Website
                    </Link>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/50"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}
