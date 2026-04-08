import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch tagline, hero text, and about text from settings
  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["tagline", "hero_description", "about_description"]);

  const settingsMap: Record<string, string> = {};
  settingsData?.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const tagline =
    settingsMap["tagline"] ||
    "Menerbitkan karya-karya berkualitas untuk pembaca nusantara";

  const heroDescription =
    settingsMap["hero_description"] ||
    "Menemani perjalanan literasi bangsa dengan menerbitkan buku-buku bermutu tinggi dari penulis-penulis terbaik.";

  const aboutDescription =
    settingsMap["about_description"] ||
    "Kami adalah penerbit yang berkomitmen menghadirkan karya-karya berkualitas dari penulis Indonesia. Dengan proses editorial yang ketat dan desain buku yang estetik, kami memastikan setiap buku yang terbit siap memikat pembaca.";

  // Fetch latest 4 books
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(4);

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36 relative">
          <div className="max-w-2xl">
            <div className="animate-fade-up">
              <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-6">
                Penerbit Buku Indonesia
              </span>
            </div>
            <h1 className="animate-fade-up-delay text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              {tagline}
            </h1>
            <p className="animate-fade-up-delay-2 text-white/90 text-lg leading-relaxed mb-8 max-w-lg">
              {heroDescription}
            </p>
            <div className="animate-fade-up-delay-2">
              <Link href="/books" className="btn-gold inline-block">
                Jelajahi Katalog →
              </Link>
            </div>
          </div>
        </div>
        <div className="divider-gold" />
      </section>

      {/* ── Latest Books Section ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">
              Terbaru
            </span>
            <h2 className="text-3xl md:text-4xl mt-2">Buku Terbaru</h2>
          </div>
          <Link
            href="/books"
            className="text-sm font-semibold text-text-secondary hover:text-navy transition-colors hidden md:block"
          >
            Lihat Semua →
          </Link>
        </div>

        {books && books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.slug}`}
                className="card group block"
              >
                <div className="aspect-[3/4] relative bg-cream overflow-hidden">
                  {book.cover_url ? (
                    <Image
                      src={book.cover_url}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading text-2xl text-text-muted/40">
                        {book.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold leading-snug mb-1 group-hover:text-gold-dark transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-text-muted">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">
              Belum ada buku yang diterbitkan.
            </p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/books" className="btn-secondary inline-block">
            Lihat Semua Buku
          </Link>
        </div>
      </section>

      {/* ── About Teaser ── */}
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">
              Tentang Kami
            </span>
            <h2 className="text-3xl md:text-4xl mt-2 mb-6">Banua Publisher</h2>
            <p className="text-text-primary leading-relaxed text-lg">
              {aboutDescription}
            </p>
            <div className="divider-gold w-24 mx-auto mt-8" />
          </div>
        </div>
      </section>
    </>
  );
}
