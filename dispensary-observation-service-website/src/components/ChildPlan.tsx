"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  CalendarDays,
  Info,
  Lock,
  StickyNote,
} from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { CHILD_ROWS, CHILD_SNOSKI, INFANT_ITEMS } from "@/lib/content";
import {
  ageLabelBe,
  ageLabelRu,
  calcAge,
  childColumnRows,
  childStage,
  infantItems,
  type Sex,
} from "@/lib/screening";
import { NvChip, SourceChip } from "./Badges";
import { PrintButton } from "./PrintButton";
import { RiskGroupsList } from "./RiskGroupsList";

function parseDob(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Разбивает значение ячейки прил. 2 на текст и сноску (звёздочки) */
function splitCell(cell: string): { text: string; note: string | null } {
  const m = cell.match(/(\*{1,4})$/);
  if (!m) return { text: cell, note: null };
  return { text: cell.slice(0, -m[1].length), note: CHILD_SNOSKI[m[1]] ?? null };
}

const COLUMN_LABEL: Record<string, string> = {
  "1-2": "1–2 года",
  "3-6": "3–6 лет",
  "7-14": "7–14 лет",
  "15": "15 лет",
  "16": "16 лет",
  "17": "17 лет",
};
const COLUMN_LABEL_BE: Record<string, string> = {
  "1-2": "1–2 гады",
  "3-6": "3–6 гадоў",
  "7-14": "7–14 гадоў",
  "15": "15 гадоў",
  "16": "16 гадоў",
  "17": "17 гадоў",
};

export function ChildPlan() {
  const { lang, d } = useLang();
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<"" | Sex>("");
  const [risk, setRisk] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const dobDate = parseDob(dob);
  const age = dobDate ? calcAge(dobDate, now) : null;
  const ageValid = !!age && age.years >= 0 && dobDate! <= now;

  const result = useMemo(() => {
    if (!submitted || !ageValid || !age) return null;
    const stage = childStage(age);
    if (stage.kind === "infant") {
      return { stage, age, items: infantItems(age.totalMonths, INFANT_ITEMS), rows: null };
    }
    if (stage.kind === "column") {
      const rows = childColumnRows(stage.colIndex, sex === "" ? null : sex, CHILD_ROWS);
      return { stage, age, items: null, rows };
    }
    return { stage, age, items: null, rows: null };
  }, [submitted, ageValid, age, sex]);

  const name = (e: { name_ru: string; name_be: string }) =>
    lang === "be" ? e.name_be : e.name_ru;
  const ageLabel = age && (lang === "be" ? ageLabelBe(age) : ageLabelRu(age));
  const colLabel = (c: string) => (lang === "be" ? COLUMN_LABEL_BE[c] : COLUMN_LABEL[c]);

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="card no-print p-5 sm:p-7"
        aria-label={d.child.title}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="ch-dob" className="mb-2 block font-semibold text-brand-950">
              {d.child.dobLabel}
            </label>
            <input
              id="ch-dob"
              type="date"
              required
              value={dob}
              max={now.toISOString().slice(0, 10)}
              min="2008-01-01"
              onChange={(e) => {
                setDob(e.target.value);
                setSubmitted(false);
              }}
              className="input"
            />
            {submitted && !ageValid && (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-amber-700">
                <AlertTriangle className="size-4" aria-hidden /> {d.adult.wrongDate}
              </p>
            )}
          </div>
          <div>
            <span className="mb-2 block font-semibold text-brand-950">
              {d.child.sexLabel}{" "}
              <span className="font-normal text-muted">({d.common.optional})</span>
            </span>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={d.child.sexLabel}>
              {(["", "f", "m"] as const).map((s) => (
                <button
                  key={s || "any"}
                  type="button"
                  role="radio"
                  aria-checked={sex === s}
                  onClick={() => setSex(s)}
                  className={`rounded-xl border-[1.5px] px-2 py-3 text-center text-[0.95rem] font-semibold transition-colors ${
                    sex === s
                      ? "border-brand-600 bg-brand-50 text-brand-900"
                      : "border-brand-200 bg-white text-ink/75 hover:border-brand-400"
                  }`}
                >
                  {s === "f" ? d.child.sexF : s === "m" ? d.child.sexM : d.child.sexAny}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[0.85rem] text-muted">{d.child.sexHint}</p>
          </div>
        </div>

        {ageValid && age && age.totalMonths < 12 && (
          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <input
              type="checkbox"
              checked={risk}
              onChange={(e) => setRisk(e.target.checked)}
              className="mt-1 size-5 accent-brand-700"
            />
            <span className="font-medium leading-snug">{d.child.riskToggle}</span>
          </label>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary" disabled={!ageValid}>
            {d.common.show}
            <ArrowRight className="size-4.5" aria-hidden />
          </button>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Lock className="size-4 text-brand-600" aria-hidden />
            {lang === "be" ? "Даныя застаюцца ў вашым браўзеры" : "Данные остаются в вашем браузере"}
          </p>
        </div>
      </form>

      {result && result.stage.kind === "adult" && (
        <div className="card p-6 sm:p-8">
          <h2 className="h-section text-xl sm:text-2xl">{d.child.adultTitle}</h2>
          <p className="lead mt-2">{d.child.adultText}</p>
          <Link href="/vzroslym" className="btn-primary mt-5">
            {d.child.adultCta}
            <ArrowRight className="size-4.5" aria-hidden />
          </Link>
        </div>
      )}

      {result && result.stage.kind !== "adult" && (
        <section aria-live="polite" className="space-y-6">
          <div className="screen-only grid gap-4 sm:grid-cols-2">
            <div className="card-flat p-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
                <CalendarDays className="size-4" aria-hidden /> {d.child.ageIs}
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-brand-950">{ageLabel}</p>
            </div>
            <div className="card-flat p-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
                <Baby className="size-4" aria-hidden /> {d.child.groupIs}
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-brand-950">
                {result.stage.kind === "infant"
                  ? lang === "be"
                    ? "да 1 года"
                    : "до 1 года"
                  : colLabel(result.stage.column)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {result.stage.kind === "infant" ? "прил. 1" : "прил. 2"} {"№ 174".replace("№", "к № ")}
              </p>
            </div>
          </div>

          <p className="flex items-start gap-2.5 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 text-[0.98rem] font-medium text-brand-900">
            <Info className="mt-0.5 size-5 shrink-0 text-brand-700" aria-hidden />
            {d.child.monthBorn}
          </p>

          {result.stage.kind === "column" && result.rows && (
            <>
              {result.stage.column === "1-2" && (
                <p className="flex items-start gap-2 text-[0.92rem] text-muted">
                  <StickyNote className="mt-0.5 size-4.5 shrink-0" aria-hidden />
                  {d.child.completionNote}
                </p>
              )}
              <div className="screen-only flex flex-wrap items-center justify-between gap-3">
                <h2 className="h-section text-xl sm:text-2xl">{d.child.tableTitle}</h2>
                <PrintButton labelKey="common.printMemo" />
              </div>
              <ul className="screen-only grid gap-3">
                {result.rows.map((r) => {
                  const cell = splitCell(r.cell);
                  return (
                    <li key={r.id} className="card-flat page-break-avoid p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                        <div className="min-w-0">
                          <p className="text-[1.06rem] font-semibold leading-snug text-brand-950">
                            {name(r)}
                            {r.pol === "f" && (
                              <span className="ml-2 align-middle text-sm font-medium text-muted">
                                ({lang === "be" ? "для дзяўчынак" : "для девочек"})
                              </span>
                            )}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <SourceChip istochnik={r.istochnik} />
                            {r.needs_verification && <NvChip />}
                          </div>
                        </div>
                        <div className="shrink-0 rounded-xl bg-brand-50 px-3.5 py-2 text-right">
                          <p className="font-bold text-brand-900">{cell.text}</p>
                        </div>
                      </div>
                      {cell.note && (
                        <p className="mt-2 text-sm text-muted">
                          <strong className="font-semibold">{d.adult.noteLabel}:</strong> {cell.note}
                        </p>
                      )}
                      {r.primechanie && (
                        <p className="mt-1 text-sm text-muted">{r.primechanie}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
              <details className="card-flat screen-only p-4 sm:p-5">
                <summary className="cursor-pointer font-semibold text-brand-900">
                  {d.child.footnotesTitle}
                </summary>
                <ul className="mt-3 space-y-1.5 text-[0.95rem] text-muted">
                  {Object.entries(CHILD_SNOSKI).map(([mark, text]) => (
                    <li key={mark}>
                      <strong className="mr-1.5 font-bold text-ink">{mark}</strong>
                      {text}
                    </li>
                  ))}
                </ul>
              </details>
            </>
          )}

          {result.stage.kind === "infant" && result.items && (
            <>
              <div className="screen-only flex flex-wrap items-center justify-between gap-3">
                <h2 className="h-section text-xl sm:text-2xl">{d.child.infantTitle}</h2>
                <PrintButton labelKey="common.printMemo" />
              </div>
              <p className="screen-only -mt-4 text-sm text-muted">{d.child.infantHint}</p>
              <ul className="screen-only grid gap-3">
                {result.items.map((it) => (
                  <li
                    key={it.id}
                    className={`card-flat page-break-avoid p-4 sm:p-5 ${
                      it.status === "window-ended" ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <div className="min-w-0">
                        <p className="text-[1.06rem] font-semibold leading-snug text-brand-950">
                          {name(it)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <SourceChip istochnik={it.istochnik} />
                          {it.needs_verification && <NvChip />}
                          <span
                            className={`chip ${
                              it.status === "due"
                                ? "chip-ok"
                                : it.status === "upcoming"
                                  ? "chip-gray"
                                  : "chip-gray"
                            }`}
                          >
                            {it.status === "due"
                              ? d.child.statusDue
                              : it.status === "upcoming"
                                ? d.child.statusUpcoming
                                : d.child.statusEnded}
                          </span>
                        </div>
                      </div>
                      <div className="max-w-xs shrink-0 rounded-xl bg-brand-50 px-3.5 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                          {d.adult.freqLabel}
                        </p>
                        <p className="text-[0.95rem] font-bold leading-snug text-brand-900">
                          {it.kratnost}
                        </p>
                      </div>
                    </div>
                    {it.uslovie && (
                      <p className="mt-2 text-sm text-muted">
                        <strong className="font-semibold">{d.adult.conditionLabel}:</strong> {it.uslovie}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              {risk && (
                <section className="space-y-4" aria-label={d.child.riskTitle}>
                  <h3 className="h-section text-lg sm:text-xl">{d.child.riskTitle}</h3>
                  <p className="flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-[0.95rem] text-amber-950">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
                    {d.child.riskNote}
                  </p>
                  <RiskGroupsList />
                </section>
              )}
            </>
          )}

          {/* Печатная памятка */}
          <div className="print-only">
            <h1 style={{ fontSize: "16pt", marginBottom: "4pt" }}>{d.child.printTitle}</h1>
            <p style={{ marginBottom: "10pt" }}>
              {d.child.ageIs}: {ageLabel} · {d.child.groupIs.toLowerCase()}:{" "}
              {result.stage.kind === "infant"
                ? lang === "be"
                  ? "да 1 года"
                  : "до 1 года"
                : colLabel(result.stage.column)}
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {(result.rows ?? result.items ?? []).map((r) => (
                  <tr key={r.id}>
                    <td style={{ borderBottom: "0.5pt solid #999", padding: "4pt 10pt 4pt 0", verticalAlign: "top" }}>
                      {name(r)}
                      <div style={{ fontSize: "9pt", color: "#333" }}>{r.istochnik}</div>
                    </td>
                    <td style={{ borderBottom: "0.5pt solid #999", padding: "4pt 0", verticalAlign: "top", width: "38%" }}>
                      {"cell" in r ? r.cell : r.kratnost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: "8pt", fontSize: "9.5pt" }}>{d.child.monthBorn}</p>
            <p style={{ marginTop: "6pt", fontSize: "9pt", color: "#333" }}>{d.adult.resultNotePrint}</p>
          </div>
        </section>
      )}
    </div>
  );
}
