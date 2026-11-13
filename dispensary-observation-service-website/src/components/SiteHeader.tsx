"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, HeartPulse, Languages, Menu, Search, X } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

const NAV: { href: string; key: string }[] = [
  { href: "/", key: "home" },
  { href: "/vzroslym", key: "adults" },
  { href: "/roditelyam", key: "kids" },
  { href: "/medrabotnikam", key: "med" },
  { href: "/faq", key: "faq" },
  { href: "/dokumenty", key: "docs" },
  { href: "/istochniki", key: "sources" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, d, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [vision, setVision] = useState(false);

  useEffect(() => {
    setVision(document.documentElement.dataset.vision === "1");
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleVision = () => {
    const next = !vision;
    setVision(next);
    if (next) document.documentElement.dataset.vision = "1";
    else delete document.documentElement.dataset.vision;
    try {
      window.localStorage.setItem("vision", next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
      >
        {d.common.skip}
      </a>
      <div className="container-site flex min-h-16 items-center gap-3 py-2">
        <Link href="/" className="flex items-center gap-2.5" aria-label={d.meta.siteName}>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-700 text-white">
            <HeartPulse className="size-5.5" aria-hidden />
          </span>
          <span className="hidden flex-col leading-tight min-[420px]:flex">
            <span className="text-[1.02rem] font-bold tracking-tight text-brand-950">
              {d.meta.siteName}
            </span>
            <span className="text-[0.72rem] font-medium text-brand-700">{d.meta.tagline}</span>
          </span>
        </Link>

        <nav aria-label={d.common.menu} className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-[0.95rem] font-medium transition-colors ${
                isActive(href)
                  ? "bg-brand-100 text-brand-900"
                  : "text-ink/80 hover:bg-brand-50 hover:text-brand-900"
              }`}
            >
              {d.nav[key as keyof typeof d.nav]}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
          <Link
            href="/poisk"
            aria-label={d.nav.search}
            className="grid size-10 place-items-center rounded-lg text-ink/70 transition-colors hover:bg-brand-50 hover:text-brand-800"
          >
            <Search className="size-5" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => setLang(lang === "ru" ? "be" : "ru")}
            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-bold text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-800"
            aria-label={d.common.langSwitch}
            title={d.common.langSwitch}
          >
            <Languages className="size-4.5" aria-hidden />
            {lang === "ru" ? "БЕ" : "RU"}
          </button>
          <button
            type="button"
            onClick={toggleVision}
            aria-pressed={vision}
            className={`grid size-10 place-items-center rounded-lg transition-colors ${
              vision ? "bg-black text-white" : "text-ink/70 hover:bg-brand-50 hover:text-brand-800"
            }`}
            aria-label={vision ? d.common.visionOff : d.common.visionOn}
            title={vision ? d.common.visionOff : d.common.visionOn}
          >
            {vision ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg text-ink/80 hover:bg-brand-50 lg:hidden"
            aria-expanded={open}
            aria-label={d.common.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label={d.common.menu} className="border-t border-brand-100 bg-white lg:hidden">
          <ul className="container-site flex flex-col py-2">
            {[...NAV, { href: "/poisk", key: "search" }].map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-[1.05rem] font-medium ${
                    isActive(href) ? "bg-brand-100 text-brand-900" : "text-ink/85"
                  }`}
                >
                  {d.nav[key as keyof typeof d.nav]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
