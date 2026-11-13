"use client";

import { CalendarCheck2, Repeat } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { RISK_GROUPS } from "@/lib/content";
import { NvChip, SourceChip } from "./Badges";

export function RiskGroupsList() {
  const { lang, d } = useLang();
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {RISK_GROUPS.map((g) => (
        <li key={g.id} className="card-flat page-break-avoid flex flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            <SourceChip istochnik={g.istochnik} />
            {g.needs_verification && <NvChip />}
          </div>
          <h3 className="mt-2 text-[1.06rem] font-bold leading-snug text-brand-950">
            {lang === "be" ? g.name_be : g.name_ru}
          </h3>
          <p className="mt-2.5 flex items-start gap-2 text-[0.95rem] text-ink/85">
            <Repeat className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden />
            <span>{g.kratnost}</span>
          </p>
          <p className="mt-1.5 flex items-start gap-2 text-[0.95rem] font-medium text-brand-900">
            <CalendarCheck2 className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden />
            <span>
              {d.child.removalLabel}: {g.uslovie.replace("снятие с наблюдения — ", "")}
            </span>
          </p>
          <p className="mt-auto pt-3 text-[0.85rem] leading-relaxed text-muted">{g.primechanie}</p>
        </li>
      ))}
    </ul>
  );
}
