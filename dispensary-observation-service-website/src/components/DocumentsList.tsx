"use client";

import { ExternalLink, FileText, Search } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { DOCUMENTS } from "@/lib/content";

export function DocumentsList() {
  const { lang, d } = useLang();
  return (
    <ul className="space-y-4">
      {DOCUMENTS.map((doc) => (
        <li key={doc.id} className="card page-break-avoid p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="deco grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <FileText className="size-5.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[1.06rem] font-bold leading-snug text-brand-950">
                {lang === "be" ? doc.title_be : doc.title_ru}
              </h2>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">
                <strong className="font-semibold text-ink">{d.docsPage.statusLabel}: </strong>
                {lang === "be" ? doc.status_be : doc.status_ru}
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 text-[0.88rem] text-muted">
                <Search className="mt-1 size-3.5 shrink-0" aria-hidden />
                <span>
                  <strong className="font-semibold">{d.docsPage.searchHint}: </strong>
                  {doc.sovety_poiska}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {doc.links.map((l) => (
                  <a
                    key={l.url + l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip chip-source transition-colors hover:border-brand-400"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
