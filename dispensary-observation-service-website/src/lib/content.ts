import vzroslye from "../../data/vzroslye.json";
import deti01 from "../../data/deti-0-1.json";
import deti117 from "../../data/deti-1-17.json";
import riskGroups from "../../data/risk-groups.json";
import healthGroups from "../../data/health-groups.json";
import faq from "../../data/faq.json";
import documents from "../../data/documents.json";
import type { AdultExamRaw, ChildRowRaw, InfantItemRaw } from "./screening";

export interface AdultGroupInfo {
  id: string;
  istochnik: string;
  vozrast: string;
  ageMin: number;
  ageMax: number | null;
  pol: string;
  kratnost: string;
  dlitelnost: number;
  uslovie: string;
  primechanie: string;
  needs_verification: boolean;
}

export const ADULT_GROUPS = vzroslye.gruppy as unknown as AdultGroupInfo[];
export const ADULT_EXAMS = vzroslye.issledovania as unknown as AdultExamRaw[];
export const INFANT_ITEMS = deti01.meropriyatiya as unknown as InfantItemRaw[];
export const CHILD_COLUMNS_LABELS = deti117.columns;
export const CHILD_SNOSKI = deti117.snoski as Record<string, string>;
export const CHILD_ROWS = deti117.rows as unknown as ChildRowRaw[];
export const RISK_GROUPS = riskGroups.gruppy;
export const HEALTH_GROUPS = healthGroups.gruppy;
export const HEALTH_GROUPS_NOTE = healthGroups.zamechanie_ru;
export const FAQ_ITEMS = faq.items;
export const DOCUMENTS = documents.akty;

export interface VerificationItem {
  id: string;
  name: string;
  istochnik: string;
  primechanie: string;
  section: string;
}

/** Автоматически собирает все позиции данных, требующие сверки с официальным текстом */
export function collectNeedsVerification(): VerificationItem[] {
  const out: VerificationItem[] = [];
  const push = <
    T extends { id: string; istochnik: string; primechanie?: string; needs_verification: boolean },
  >(
    arr: readonly T[],
    getName: (x: T) => string,
    section: string,
  ) => {
    for (const x of arr) {
      if (x.needs_verification) {
        out.push({
          id: `${section}:${x.id}`,
          name: getName(x),
          istochnik: x.istochnik,
          primechanie: x.primechanie ?? "",
          section,
        });
      }
    }
  };
  push(ADULT_GROUPS, (g) => `Группа «${g.vozrast}»`, "Взрослые — группы");
  push(ADULT_EXAMS, (e) => e.name_ru, "Взрослые — исследования");
  push(CHILD_ROWS, (r) => r.name_ru, "Дети 1–17 лет (прил. 2)");
  push(
    RISK_GROUPS as unknown as {
      id: string;
      istochnik: string;
      name_ru: string;
      primechanie: string;
      needs_verification: boolean;
    }[],
    (g) => g.name_ru,
    "Дети до 1 года — риск (прил. 3)",
  );
  return out;
}
