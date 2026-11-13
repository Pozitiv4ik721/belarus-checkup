"use client";

import Link from "next/link";
import { ExternalLink, HeartPulse, Info } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

export function SiteFooter() {
  const { d } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-brand-100 bg-white">
      <div className="container-site grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-700 text-white">
              <HeartPulse className="size-5" aria-hidden />
            </span>
            <span className="font-bold tracking-tight text-brand-950">{d.meta.siteName}</span>
          </div>
          <p className="mt-4 flex max-w-xl items-start gap-2 text-[0.95rem] leading-relaxed text-muted">
            <Info className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden />
            <span>{d.footer.disclaimer}</span>
          </p>
          <p className="mt-3 text-[0.9rem] text-muted">
            <strong className="font-semibold text-ink">{d.footer.actual}:</strong>{" "}
            {d.footer.actualValue}
          </p>
        </div>
        <nav aria-label={d.footer.sections}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand-800">
            {d.footer.sections}
          </h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {[
              ["/vzroslym", d.nav.adults],
              ["/roditelyam", d.nav.kids],
              ["/medrabotnikam", d.nav.med],
              ["/faq", d.nav.faq],
              ["/dokumenty", d.nav.docs],
              ["/istochniki", d.nav.sources],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-ink/80 hover:text-brand-700 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand-800">
            {d.footer.official}
          </h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {[
              ["etalonline.by — «Эталон-Online»", "https://etalonline.by/"],
              ["pravo.by — правовой портал", "https://pravo.by/"],
              ["minzdrav.gov.by — Минздрав", "https://minzdrav.gov.by/"],
            ].map(([label, url]) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink/80 hover:text-brand-700 hover:underline"
                >
                  {label}
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100 py-4">
        <p className="container-site text-[0.85rem] text-muted">
          © {year} · {d.footer.madeBy}
        </p>
      </div>
    </footer>
  );
}
