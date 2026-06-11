import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ChatWidget from "@/components/ai/ChatWidget";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SINGULAR.i — Desenvolvimento de Software",
  description: "Soluções modernas em desenvolvimento de software. Criamos sistemas digitais, plataformas web e soluções tecnológicas focadas em resolver problemas reais.",
  icons: {
    icon: "/images/logo_aceite.jpg.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <ChatWidget />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
