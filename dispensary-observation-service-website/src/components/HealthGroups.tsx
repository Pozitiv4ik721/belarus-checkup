"use client";

import { HeartPulse } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { HEALTH_GROUPS } from "@/lib/content";
import { SourceChip } from "./Badges";

export function HealthGroups() {
  const { lang, d } = useLang();
  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2">
        {HEALTH_GROUPS.map((g) => (
          <li key={g.id} className="card-flat page-break-avoid flex items-start gap-4 p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-700 text-xl font-bold text-white">
              {g.id}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-brand-950">
                {lang === "be" ? g.name_be : g.name_ru}
              </h3>
              <p className="mt-1 text-[0.97rem] leading-snug text-ink/85">{g.uslovie}</p>
              <div className="mt-2">
                <SourceChip istochnik={g.istochnik} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-start gap-2 text-[0.95rem] text-muted">
        <HeartPulse className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden />
        {lang === "be"
          ? "Крытэрыі па п. 9.1 Інструкцыі № 174. Вынікавае рашэнне аб групе здароўя прымае ўрач."
          : d.med.groupsNote}
      </p>
    </>
  );
}
