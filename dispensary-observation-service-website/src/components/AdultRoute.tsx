"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  Lock,
  Repeat,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import {
  ADULT_EXAMS,
  ADULT_GROUPS,
} from "@/lib/content";
import {
  adultExamsFor,
  adultGroup,
  ageLabelBe,
  ageLabelRu,
  calcAge,
  type AdultExamResult,
  type Sex,
} from "@/lib/screening";
import { NvChip, SourceChip } from "./Badges";
import { PrintButton } from "./PrintButton";

function parseDob(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function AdultRoute() {
  const { lang, d } = useLang();
  const [sex, setSex] = useState<Sex>("f");
  const [dob, setDob] = useState("");
  const [prePension, setPrePension] = useState<"" | "yes" | "no">("");
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const dobDate = parseDob(dob);
  const age = dobDate ? calcAge(dobDate, now) : null;
  const ageValid = !!age && age.years >= 0 && age.years <= 130 && dobDate! <= now;
  const showPension = ageValid && age!.years >= 40;

  const result = useMemo(() => {
    if (!submitted || !ageValid || !age) return null;
    const group = adultGroup(age.years, prePension === "yes");
    if (group === "under18") return { group, age, exams: [] as AdultExamResult[], groupInfo: null };
    if (age.years >= 40 && prePension === "") return null; // ждём ответ
    const exams = adultExamsFor(age.years, sex, ADULT_EXAMS);
    const groupInfo = ADULT_GROUPS.find((g) => g.id === group) ?? null;
    return { group, age, exams, groupInfo };
  }, [submitted, ageValid, age, prePension, sex]);

  const needPensionAnswer = submitted && showPension && prePension === "";
  const name = (e: { name_ru: string; name_be: string }) =>
    lang === "be" ? e.name_be : e.name_ru;
  const ageLabel = (a: NonNullable<typeof age>) =>
    lang === "be" ? ageLabelBe(a) : ageLabelRu(a);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="card no-print p-5 sm:p-7" aria-label={d.adult.title}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="ar-sex" className="mb-2 block font-semibold text-brand-950">
              {d.adult.sexLabel}
            </label>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={d.adult.sexLabel}>
              {(["f", "m"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={sex === s}
                  onClick={() => setSex(s)}
                  className={`rounded-xl border-[1.5px] px-3 py-3 text-center font-semibold transition-colors ${
                    sex === s
                      ? "border-brand-600 bg-brand-50 text-brand-900"
                      : "border-brand-200 bg-white text-ink/75 hover:border-brand-400"
                  }`}
                >
                  {s === "f" ? d.adult.sexF : d.adult.sexM}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="ar-dob" className="mb-2 block font-semibold text-brand-950">
              {d.adult.dobLabel}
            </label>
            <input
              id="ar-dob"
              type="date"
              required
              value={dob}
              max={now.toISOString().slice(0, 10)}
              min="1900-01-01"
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
        </div>

        {showPension && (
          <fieldset className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 sm:p-5">
            <legend className="px-1 font-semibold text-brand-950">{d.adult.pensionTitle}</legend>
            <p className="text-[1.02rem] font-medium">{d.adult.pensionQ}</p>
            <div className={`mt-3 grid gap-2 sm:grid-cols-2 ${needPensionAnswer ? "rounded-xl ring-2 ring-amber-500" : ""}`}>
              {(["no", "yes"] as const).map((v) => (
                <label
                  key={v}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 font-medium transition-colors ${
                    prePension === v
                      ? "border-brand-600 bg-white text-brand-900"
                      : "border-brand-200 bg-white/70 text-ink/80 hover:border-brand-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="prepension"
                    value={v}
                    checked={prePension === v}
                    onChange={() => setPrePension(v)}
                    className="size-4.5 accent-brand-700"
                  />
                  {v === "yes" ? d.adult.pensionYes : d.adult.pensionNo}
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden />
              <span>
                {d.adult.pensionHint}{" "}
                <a
                  href="https://pravo.by/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
                >
                  pravo.by
                </a>{" "}
                <a
                  href="https://ssf.gov.by/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-semibold text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
                >
                  ssf.gov.by <ExternalLink className="size-3" aria-hidden />
                </a>
              </span>
            </p>
          </fieldset>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary" disabled={!ageValid}>
            {d.common.show}
            <ArrowRight className="size-4.5" aria-hidden />
          </button>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Lock className="size-4 text-brand-600" aria-hidden />
            {lang === "be"
              ? "Даныя застаюцца ў вашым браўзеры"
              : "Данные остаются в вашем браузере"}
          </p>
        </div>
      </form>

      {result && result.group === "under18" && (
        <div className="card p-6 sm:p-8">
          <h2 className="h-section text-xl sm:text-2xl">{d.adult.under18Title}</h2>
          <p className="lead mt-2">{d.adult.under18Text}</p>
          <Link href="/roditelyam" className="btn-primary mt-5">
            {d.adult.under18Cta}
            <ArrowRight className="size-4.5" aria-hidden />
          </Link>
        </div>
      )}

      {needPensionAnswer && (
        <p className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-medium text-amber-900">
          <AlertTriangle className="size-5" aria-hidden />
          {d.adult.pensionQ}
        </p>
      )}

      {result && result.exams.length > 0 && result.groupInfo && (
        <section aria-live="polite" className="space-y-6">
          <div className="screen-only grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-flat p-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
                <CalendarDays className="size-4" aria-hidden /> {d.adult.ageIs}
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-brand-950">
                {ageLabel(result.age)}
              </p>
            </div>
            <div className="card-flat p-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
                <Users className="size-4" aria-hidden /> {d.adult.groupTitle}
              </p>
              <p className="mt-1.5 text-[1.05rem] font-bold leading-snug text-brand-950">
                {result.groupInfo.vozrast}
              </p>
              <div className="mt-2"><SourceChip istochnik={result.groupInfo.istochnik} /></div>
            </div>
            <div className="card-flat p-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
                <Repeat className="size-4" aria-hidden /> {d.adult.freqTitle}
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-brand-950">
                {result.groupInfo.kratnost}
              </p>
            </div>
            <div className="card-flat p-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
                <Clock3 className="size-4" aria-hidden /> {d.adult.durTitle}
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-brand-950">
                {result.groupInfo.dlitelnost === 2 ? d.adult.dur2 : d.adult.dur1}
              </p>
            </div>
          </div>

          <p className="screen-only flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-[0.98rem] leading-relaxed text-amber-950">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>{d.adult.checkBanner}</span>
          </p>

          <div className="screen-only flex flex-wrap items-center justify-between gap-3">
            <h2 className="h-section text-xl sm:text-2xl">
              {d.adult.examsTitle}{" "}
              <span className="text-muted">· {result.exams.length} {d.adult.examsCount}</span>
            </h2>
            <PrintButton labelKey="common.printMemo" />
          </div>

          <ul className="screen-only grid gap-3">
            {result.exams.map((e) => (
              <li key={e.id} className="card-flat page-break-avoid p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="text-[1.06rem] font-semibold leading-snug text-brand-950">
                      {name(e)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <SourceChip istochnik={e.istochnik} />
                      {e.needs_verification && <NvChip />}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl bg-brand-50 px-3.5 py-2 text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                      {d.adult.freqLabel}
                    </p>
                    <p className="font-bold text-brand-900">{e.kratnostForUser}</p>
                  </div>
                </div>
                {(e.uslovie || e.primechanie) && (
                  <div className="mt-2.5 space-y-1 text-sm text-muted">
                    {e.uslovie && (
                      <p><strong className="font-semibold">{d.adult.conditionLabel}:</strong> {e.uslovie}</p>
                    )}
                    {e.primechanie && (
                      <p><strong className="font-semibold">{d.adult.noteLabel}:</strong> {e.primechanie}</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Печатная версия — чистая памятка */}
          <div className="print-only">
            <h1 style={{ fontSize: "16pt", marginBottom: "4pt" }}>{d.adult.printTitle}</h1>
            <p style={{ marginBottom: "2pt" }}>
              {d.adult.ageIs}: {ageLabel(result.age)} · {d.adult.groupTitle.toLowerCase()}: {result.groupInfo.vozrast}
            </p>
            <p style={{ marginBottom: "10pt" }}>
              {d.adult.freqTitle.toLowerCase()}: {result.groupInfo.kratnost}; {d.adult.durTitle.toLowerCase()}:{" "}
              {result.groupInfo.dlitelnost === 2 ? d.adult.dur2 : d.adult.dur1} ({result.groupInfo.istochnik})
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1.5pt solid #000", padding: "4pt 6pt 4pt 0" }}>
                    {d.adult.examsTitle}
                  </th>
                  <th style={{ textAlign: "left", borderBottom: "1.5pt solid #000", padding: "4pt 0" }}>
                    {d.adult.freqLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.exams.map((e) => (
                  <tr key={e.id}>
                    <td style={{ borderBottom: "0.5pt solid #999", padding: "4pt 10pt 4pt 0", verticalAlign: "top" }}>
                      {name(e)}
                      <div style={{ fontSize: "9pt", color: "#333" }}>{e.istochnik}</div>
                    </td>
                    <td style={{ borderBottom: "0.5pt solid #999", padding: "4pt 0", verticalAlign: "top" }}>
                      {e.kratnostForUser}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: "10pt", fontSize: "9pt", color: "#333" }}>{d.adult.resultNotePrint}</p>
          </div>
        </section>
      )}
    </div>
  );
}
