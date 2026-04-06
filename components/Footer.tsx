"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();

    // Don't show public footer on admin pages
    if (pathname.startsWith("/admin")) return null;

    return (
        <footer className="bg-navy text-white/80 mt-auto">
            <div className="divider-gold" />
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gold flex items-center justify-center">
                                <span className="text-navy font-heading font-bold text-sm">
                                    B
                                </span>
                            </div>
                            <span className="font-heading text-lg font-bold text-white">
                                Banua Publisher
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/60">
                            Menerbitkan karya-karya berkualitas untuk pembaca nusantara.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-heading text-sm font-bold text-gold uppercase tracking-wider mb-4">
                            Navigasi
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/books"
                                    className="text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    Katalog Buku
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-heading text-sm font-bold text-gold uppercase tracking-wider mb-4">
                            Kontak
                        </h4>
                        <div className="space-y-2 text-sm text-white/60">
                            <p>info@banuapublisher.com</p>
                            <p>Kalimantan Selatan, Indonesia</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
                    © {new Date().getFullYear()} Banua Publisher. Hak cipta dilindungi.
                </div>
            </div>
        </footer>
    );
}
