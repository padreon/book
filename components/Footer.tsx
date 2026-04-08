"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer({ settings }: { settings?: Record<string, string> }) {
    const pathname = usePathname();

    // Don't show public footer on admin pages
    if (pathname.startsWith("/admin")) return null;

    const siteName = settings?.publisher_name || "Banua Publisher";
    const tagline = settings?.tagline || "Menerbitkan karya-karya berkualitas untuk pembaca nusantara.";
    const email = settings?.email;
    const phone = settings?.phone;
    const whatsapp = settings?.whatsapp_number;
    const address = settings?.address;
    const logoUrl = settings?.logo_url;
    const footerText = settings?.footer_text || `© ${new Date().getFullYear()} ${siteName}. Hak cipta dilindungi.`;

    return (
        <footer className="bg-navy text-white/80 mt-auto">
            <div className="divider-gold" />
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            {logoUrl ? (
                                <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={logoUrl} alt={`${siteName} Logo`} className="object-cover w-full h-full" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 bg-gold flex items-center justify-center flex-shrink-0">
                                    <span className="text-navy font-heading font-bold text-sm">
                                        {siteName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <span className="font-heading text-lg font-bold text-white">
                                {siteName}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/60">
                            {tagline}
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
                            {email && <p>{email}</p>}
                            {phone && <p>{phone}</p>}
                            {whatsapp && <p>WA: {whatsapp}</p>}
                            {address && <p>{address}</p>}
                            {!email && !phone && !whatsapp && !address && (
                                <>
                                    <p>info@banuapublisher.com</p>
                                    <p>Kalimantan Selatan, Indonesia</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
                    {footerText}
                </div>
            </div>
        </footer>
    );
}
