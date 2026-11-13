"use client";

import { Printer } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

export function PrintButton({ labelKey = "common.print" }: { labelKey?: string }) {
  const { d } = useLang();
  const label =
    labelKey.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
      return undefined;
    }, d) ?? labelKey;
  return (
    <button type="button" onClick={() => window.print()} className="btn-ghost no-print">
      <Printer className="size-4.5" aria-hidden />
      {typeof label === "string" ? label : labelKey}
    </button>
  );
}
