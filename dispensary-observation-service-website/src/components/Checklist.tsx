"use client";

import { useState } from "react";
import { BookOpen, CheckSquare, Square } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { NvChip } from "./Badges";

export function Checklist() {
  const { d } = useLang();
  const [done, setDone] = useState<boolean[]>(() => d.med.checklist.map(() => false));

  return (
    <ol className="space-y-2.5">
      {d.med.checklist.map((item, i) => (
        <li key={i}>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
              done[i] ? "border-brand-300 bg-brand-50" : "border-brand-100 bg-white hover:border-brand-300"
            }`}
          >
            <input
              type="checkbox"
              checked={done[i]}
              onChange={(e) =>
                setDone((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))
              }
              className="sr-only"
            />
            <span className="mt-0.5 shrink-0 text-brand-700" aria-hidden>
              {done[i] ? <CheckSquare className="size-5.5" /> : <Square className="size-5.5" />}
            </span>
            <span className="min-w-0">
              <span className={`block text-[1rem] font-medium leading-snug ${done[i] ? "text-brand-900" : "text-ink"}`}>
                {item.text}
              </span>
              <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm">
                <span className="chip chip-source">
                  <BookOpen className="size-3.5" aria-hidden />
                  {item.src}
                </span>
                {item.nv && <NvChip />}
              </span>
            </span>
          </label>
        </li>
      ))}
    </ol>
  );
}
