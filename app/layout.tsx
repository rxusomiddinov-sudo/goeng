import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "GoEng: IELTS tayyorgarlik",
  description: "IELTS band hisoblagich va Writing AI tekshiruvi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <Nav />
        <main className="max-w-3xl mx-auto p-4 pb-16">{children}</main>
        <footer className="text-center text-xs mu p-6">
          Natijalar taxminiy. IELTS British Council, IDP va Cambridge’ning savdo belgisi, GoEng ular bilan bog’liq emas.
        </footer>
      </body>
    </html>
  );
}
