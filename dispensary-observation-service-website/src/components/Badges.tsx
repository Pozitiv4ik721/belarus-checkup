"use client";

import { AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

export function SourceChip({ istochnik }: { istochnik: string }) {
  const { d } = useLang();
  return (
    <span className="chip chip-source" title={`${d.common.source}: ${istochnik}`}>
      <BookOpen className="size-3.5" aria-hidden />
      {istochnik}
    </span>
  );
}

export function NvChip() {
  const { d } = useLang();
  return (
    <span className="chip chip-warn" title={d.common.checkBadgeTitle}>
      <AlertTriangle className="size-3.5" aria-hidden />
      {d.common.checkBadge}
    </span>
  );
}

export function OkChip() {
  const { d } = useLang();
  return (
    <span className="chip chip-ok">
      <CheckCircle2 className="size-3.5" aria-hidden />
      {d.common.verifiedOk}
    </span>
  );
}
