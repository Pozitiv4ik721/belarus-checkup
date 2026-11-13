import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LangProvider } from "@/i18n/LangProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dispanserie.by"),
  title: {
    default: "Диспансеризация в Беларуси — перечни обследований по постановлениям № 173 и № 174",
    template: "%s · Диспансеризация в Беларуси",
  },
  description:
    "Справочно-практический сервис: персональный перечень обследований по Инструкциям о диспансеризации взрослых (№ 173) и детей (№ 174) Минздрава РБ, ред. 2026 г. Группы здоровья, карта 3/у-ДР, калькулятор охвата.",
  keywords: [
    "диспансеризация",
    "Беларусь",
    "постановление 173",
    "постановление 174",
    "диспансеризация детей",
    "группы здоровья",
    "3/у-ДР",
  ],
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#14645c",
  width: "device-width",
  initialScale: 1,
};

const bootScript = `try{var v=localStorage.getItem('vision');if(v==='1'){document.documentElement.dataset.vision='1'}var l=localStorage.getItem('lang');if(l==='be'){document.documentElement.lang='be'}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <LangProvider>
          <SiteHeader />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <SiteFooter />
        </LangProvider>
      </body>
    </html>
  );
}
