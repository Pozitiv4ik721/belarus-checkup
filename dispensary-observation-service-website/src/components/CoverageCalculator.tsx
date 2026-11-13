"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle2, TrendingDown } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { coveragePercent } from "@/lib/screening";

export function CoverageCalculator() {
  const { d } = useLang();
  const [done, setDone] = useState("");
  const [subject, setSubject] = useState("");

  const result = useMemo(() => {
    if (done === "" || subject === "") return null;
    const a = Number(done);
    const b = Number(subject);
    return coveragePercent(a, b);
  }, [done, subject]);

  const fmt = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

  return (
    <div className="card p-5 sm:p-7">
      <p className="text-[0.95rem] text-muted">{d.med.coverageFormula}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cov-done" className="mb-1.5 block font-semibold text-brand-950">
            {d.med.coverageDone}
          </label>
          <input
            id="cov-done"
            type="number"
            min={0}
            inputMode="numeric"
            value={done}
            onChange={(e) => setDone(e.target.value)}
            className="input"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="cov-subject" className="mb-1.5 block font-semibold text-brand-950">
            {d.med.coverageSubject}
          </label>
          <input
            id="cov-subject"
            type="number"
            min={0}
            inputMode="numeric"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
            placeholder="0"
          />
        </div>
      </div>

      {result !== null && (
        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-5" aria-live="polite">
          <Calculator className="size-8 text-brand-700" aria-hidden />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              {d.med.coverageResult}
            </p>
            <p className="text-3xl font-bold tracking-tight text-brand-950">{fmt(result)} %</p>
          </div>
          <div className="min-w-60 flex-1">
            <p className="text-[0.95rem] font-medium text-ink/90">{d.med.coverageChildTarget}</p>
            <p
              className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
                result >= 95 ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
              }`}
            >
              {result >= 95 ? (
                <CheckCircle2 className="size-4" aria-hidden />
              ) : (
                <TrendingDown className="size-4" aria-hidden />
              )}
              {result >= 95 ? d.med.coverageChildOk : d.med.coverageChildLow}
            </p>
          </div>
        </div>
      )}
      <p className="mt-4 text-[0.88rem] text-muted">{d.med.coverageAdultsNote}</p>
    </div>
  );
}
