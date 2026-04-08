import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { createClient } from "@/lib/supabase/server";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["publisher_name", "meta_description", "favicon_url"]);

  const settingsMap: Record<string, string> = {};
  settingsData?.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const title = settingsMap["publisher_name"] || "Banua Publisher";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description:
      settingsMap["meta_description"] ||
      "Penerbit buku Indonesia — menerbitkan karya-karya berkualitas untuk pembaca nusantara.",
    icons: settingsMap["favicon_url"] ? { icon: settingsMap["favicon_url"] } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settingsMap: Record<string, string> = {};
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value");
    if (data) {
        data.forEach((s) => {
            settingsMap[s.key] = s.value;
        });
    }
  } catch {
    // Supabase not configured yet
  }

  const gaId = settingsMap["google_analytics_id"] || "";
  const siteName = settingsMap["publisher_name"] || "Banua Publisher";
  const logoUrl = settingsMap["logo_url"] || "";

  return (
    <html
      lang="id"
      className={`${playfair.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics gaId={gaId} />
        <Header siteName={siteName} logoUrl={logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer settings={settingsMap} />
      </body>
    </html>
  );
}
