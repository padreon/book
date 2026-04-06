"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/books", label: "Buku" },
    { href: "/contact", label: "Kontak" },
];

export function Header() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    // Don't show public header on admin pages
    if (pathname.startsWith("/admin")) return null;

    return (
        <header className="sticky top-0 z-50 bg-warm-white/95 backdrop-blur-sm border-b border-border-light">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-navy flex items-center justify-center">
                        <span className="text-gold font-heading font-bold text-sm">B</span>
                    </div>
                    <span className="font-heading text-lg font-bold text-navy tracking-tight">
                        Banua Publisher
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold tracking-wide transition-colors ${pathname === link.href
                                    ? "text-gold-dark"
                                    : "text-text-secondary hover:text-navy"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-navy"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        {menuOpen ? (
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
            </div>

            {/* Mobile Nav */}
            {menuOpen && (
                <nav className="md:hidden border-t border-border-light bg-warm-white px-6 py-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`block py-2 text-sm font-semibold ${pathname === link.href
                                    ? "text-gold-dark"
                                    : "text-text-secondary hover:text-navy"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}
