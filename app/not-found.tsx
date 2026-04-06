import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <section className="bg-navy">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                        404
                    </span>
                    <h1 className="text-3xl md:text-4xl text-white mt-2">
                        Halaman Tidak Ditemukan
                    </h1>
                </div>
                <div className="divider-gold" />
            </section>

            <section className="max-w-2xl mx-auto px-6 py-20 text-center">
                <div className="font-heading text-8xl text-border mb-6">404</div>
                <p className="text-text-secondary text-lg mb-8">
                    Maaf, halaman yang Anda cari tidak ditemukan atau sudah dipindahkan.
                </p>
                <Link href="/" className="btn-primary inline-block">
                    Kembali ke Beranda
                </Link>
            </section>
        </>
    );
}
