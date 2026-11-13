"use client";

import { useLang } from "@/i18n/LangProvider";
import { FAQ_ITEMS } from "@/lib/content";
import { NvChip, SourceChip } from "./Badges";

export function FaqList() {
  const { lang, d } = useLang();
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <details key={item.id} className="card group p-0 open:border-brand-300" {...(i === 0 ? { open: true } : {})}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[1.08rem] font-semibold text-brand-950 marker:hidden [&::-webkit-details-marker]:hidden">
            {lang === "be" ? item.q_be : item.q_ru}
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="border-t border-brand-100 px-5 py-4">
            <p className="max-w-3xl leading-relaxed text-ink/90">
              {lang === "be" ? item.a_be : item.a_ru}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <SourceChip istochnik={item.istochnik} />
              {item.needs_verification && <NvChip />}
              {item.id === "vyhodnoi" && (
                <a
                  href="https://pravo.by/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip chip-ok"
                >
                  pravo.by
                </a>
              )}
              {item.id === "privacy" && <span className="chip chip-gray">{d.footer.actualValue}</span>}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
