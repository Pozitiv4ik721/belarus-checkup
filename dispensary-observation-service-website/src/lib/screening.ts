/**
 * Чистые функции расчёта маршрутов диспансеризации.
 * Никаких побочных эффектов, только математика над данными из /data.
 * Все возрасты и перечни — по Инструкциям № 173 и № 174 (см. поля istochnik в данных).
 */

export type Sex = "m" | "f";

export interface Age {
  years: number;
  months: number; // месяцы сверх полных лет
  totalMonths: number;
  days: number; // дни сверх полных месяцев
}

/** Полный возраст на дату `on` */
export function calcAge(dob: Date, on: Date): Age {
  let years = on.getFullYear() - dob.getFullYear();
  let months = on.getMonth() - dob.getMonth();
  let days = on.getDate() - dob.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(on.getFullYear(), on.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return { years: -1, months: 0, totalMonths: -1, days: 0 };
  return { years, months, totalMonths: years * 12 + months, days };
}

/* ---------- Взрослые (Инструкция № 173) ---------- */

export type AdultGroupId = "under18" | "g18-39" | "g40" | "g-prepens";

/**
 * Группа диспансеризации взрослых.
 * prePension — ответ пользователя на вопрос «Достигнут общеустановленный
 * пенсионный возраст или осталось не более 5 лет?» (пенсионный возраст
 * намеренно не зашит в код: он зависит от пола и даты рождения).
 * Источник: п. 5.1–5.2 Инструкции № 173.
 */
export function adultGroup(ageYears: number, prePension: boolean): AdultGroupId {
  if (ageYears < 18) return "under18";
  if (ageYears <= 39) return "g18-39";
  return prePension ? "g-prepens" : "g40";
}

export interface AdultExamRaw {
  id: string;
  istochnik: string;
  name_ru: string;
  name_be: string;
  vozrast: string;
  ageMin: number;
  ageMax: number | null;
  pol: "any" | Sex;
  freq_18_39: string | null;
  freq_40: string | null;
  kratnost: string;
  uslovie: string;
  primechanie: string;
  needs_verification: boolean;
}

export interface AdultExamResult extends AdultExamRaw {
  kratnostForUser: string;
}

/** Перечень исследований для конкретного человека (Прил. 1 к № 173, ред. № 13 — сверяется) */
export function adultExamsFor(
  ageYears: number,
  sex: Sex,
  exams: AdultExamRaw[],
): AdultExamResult[] {
  const is1839 = ageYears <= 39;
  return exams
    .filter(
      (e) =>
        (e.pol === "any" || e.pol === sex) &&
        ageYears >= e.ageMin &&
        (e.ageMax === null || ageYears <= e.ageMax),
    )
    .map((e) => {
      const freq = is1839 ? e.freq_18_39 : e.freq_40;
      return { ...e, kratnostForUser: freq ?? "" };
    })
    .filter((e) => e.kratnostForUser !== "");
}

/* ---------- Дети (Инструкция № 174) ---------- */

export const CHILD_COLUMNS = ["1-2", "3-6", "7-14", "15", "16", "17"] as const;
export type ChildColumnId = (typeof CHILD_COLUMNS)[number];

export type ChildStage =
  | { kind: "infant" }
  | { kind: "column"; column: ChildColumnId; colIndex: number }
  | { kind: "adult" };

/**
 * Возрастная группа ребёнка.
 * До 1 года (менее 12 полных месяцев) — грудной возраст, Прил. 1 (+Прил. 3 при факторах риска).
 * Далее — колонка таблицы Прил. 2: 1–2, 3–6, 7–14, 15, 16, 17 лет.
 */
export function childStage(age: Age): ChildStage {
  if (age.totalMonths < 0) return { kind: "adult" };
  if (age.totalMonths < 12) return { kind: "infant" };
  const y = age.years;
  if (y >= 18) return { kind: "adult" };
  if (y <= 2) return { kind: "column", column: "1-2", colIndex: 0 };
  if (y <= 6) return { kind: "column", column: "3-6", colIndex: 1 };
  if (y <= 14) return { kind: "column", column: "7-14", colIndex: 2 };
  if (y === 15) return { kind: "column", column: "15", colIndex: 3 };
  if (y === 16) return { kind: "column", column: "16", colIndex: 4 };
  return { kind: "column", column: "17", colIndex: 5 };
}

export interface ChildRowRaw {
  id: string;
  istochnik: string;
  name_ru: string;
  name_be: string;
  vozrast: string;
  pol: "any" | Sex;
  cells: (string | null)[];
  kratnost: string;
  uslovie: string;
  primechanie: string;
  needs_verification: boolean;
}

export interface ChildRowResult extends ChildRowRaw {
  cell: string;
}

/** Строки прил. 2, применимые к возрасту/полу ребёнка */
export function childColumnRows(
  colIndex: number,
  sex: Sex | null,
  rows: ChildRowRaw[],
): ChildRowResult[] {
  return rows
    .filter((r) => (r.pol === "any" || sex === null || r.pol === sex))
    .map((r) => ({ ...r, cell: r.cells[colIndex] ?? "" }))
    .filter((r) => r.cell !== "");
}

export interface InfantItemRaw {
  id: string;
  istochnik: string;
  name_ru: string;
  name_be: string;
  vozrast: string;
  ageMinMes: number;
  ageMaxMes: number;
  pol: "any" | Sex;
  kratnost: string;
  uslovie: string;
  primechanie: string;
  needs_verification: boolean;
}

export type InfantStatus = "due" | "upcoming" | "window-ended";

export interface InfantItemResult extends InfantItemRaw {
  status: InfantStatus;
}

/** Прил. 1: элементы схемы для грудного возраста со статусом окна */
export function infantItems(
  totalMonths: number,
  items: InfantItemRaw[],
): InfantItemResult[] {
  return items.map((it) => {
    let status: InfantStatus = "due";
    if (totalMonths < it.ageMinMes) status = "upcoming";
    else if (totalMonths > it.ageMaxMes) status = "window-ended";
    return { ...it, status };
  });
}

/* ---------- Охват (п. 15 Инструкции № 174) ---------- */

/** охват = проведено / подлежало × 100, округление до десятых; null если знаменатель ≤ 0 */
export function coveragePercent(done: number, subject: number): number | null {
  if (!Number.isFinite(done) || !Number.isFinite(subject)) return null;
  if (subject <= 0 || done < 0) return null;
  return Math.round((done / subject) * 1000) / 10;
}

/* ---------- Форматирование возраста ---------- */

export function pluralRu(n: number, forms: [string, string, string]): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

export function ageLabelRu(age: Age): string {
  if (age.years >= 1) {
    const y = `${age.years} ${pluralRu(age.years, ["год", "года", "лет"])}`;
    return age.months > 0
      ? `${y} ${age.months} ${pluralRu(age.months, ["месяц", "месяца", "месяцев"])}`
      : y;
  }
  return `${age.totalMonths} ${pluralRu(age.totalMonths, ["месяц", "месяца", "месяцев"])}`;
}

export function pluralBe(n: number, forms: [string, string, string]): string {
  return pluralRu(n, forms);
}

export function ageLabelBe(age: Age): string {
  if (age.years >= 1) {
    const y = `${age.years} ${pluralBe(age.years, ["год", "гады", "гадоў"])}`;
    return age.months > 0
      ? `${y} ${age.months} ${pluralBe(age.months, ["месяц", "месяцы", "месяцаў"])}`
      : y;
  }
  return `${age.totalMonths} ${pluralBe(age.totalMonths, ["месяц", "месяцы", "месяцаў"])}`;
}
