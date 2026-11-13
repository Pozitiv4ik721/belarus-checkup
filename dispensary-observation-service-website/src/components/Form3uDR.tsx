"use client";

import { Info } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { PrintButton } from "./PrintButton";

function Field({
  label,
  wide = false,
  area = false,
  type = "text",
}: {
  label: string;
  wide?: boolean;
  area?: boolean;
  type?: string;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-[0.92rem] font-semibold text-brand-950">{label}</span>
      {area ? (
        <textarea rows={3} className="input resize-y" />
      ) : (
        <input type={type} className="input" />
      )}
    </label>
  );
}

export function Form3uDR() {
  const { d } = useLang();
  const f = d.med.cardFields;
  return (
    <div className="space-y-4">
      <p className="screen-only flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-[0.95rem] text-amber-950">
        <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
        <span>{d.med.cardNote}</span>
      </p>
      <div className="card page-break-avoid p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-100 pb-4">
          <div>
            <h3 className="h-section text-lg">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.subtitle}</p>
          </div>
          <PrintButton labelKey="med.cardPrint" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label={f.fio} wide />
          <Field label={f.dob} type="date" />
          <Field label={f.sex} />
          <Field label={f.address} wide />
          <Field label={f.parent} wide />
          <Field label={f.org} wide />
          <Field label={f.date} type="date" />
          <Field label={f.healthGroup} />
          <Field label={f.exams} wide area />
          <Field label={f.conclusion} wide area />
          <Field label={f.sign} />
        </div>
        <p className="screen-only mt-4 text-sm text-muted">{f.printHint}</p>
      </div>
    </div>
  );
}
