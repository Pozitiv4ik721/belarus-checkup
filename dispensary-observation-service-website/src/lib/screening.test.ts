import { describe, expect, it } from "vitest";
import {
  adultExamsFor,
  adultGroup,
  ageLabelRu,
  calcAge,
  childStage,
  coveragePercent,
  type AdultExamRaw,
} from "./screening";
import vzroslye from "../../data/vzroslye.json";

const exams = vzroslye.issledovania as AdultExamRaw[];
const ON = new Date(2026, 5, 1); // 1 июня 2026 — фиксированная точка отсчёта

describe("calcAge — граничные значения", () => {
  it("17 лет 364 дня — ещё ребёнок", () => {
    const a = calcAge(new Date(2008, 5, 2), ON);
    expect(a.years).toBe(17);
  });
  it("18 лет ровно — взрослый", () => {
    expect(calcAge(new Date(2008, 5, 1), ON).years).toBe(18);
  });
  it("39 лет ровно", () => {
    expect(calcAge(new Date(1987, 5, 1), ON).years).toBe(39);
  });
  it("40 лет ровно", () => {
    expect(calcAge(new Date(1986, 5, 1), ON).years).toBe(40);
  });
  it("11 месяцев — грудной возраст", () => {
    const a = calcAge(new Date(2025, 6, 1), ON);
    expect(a.totalMonths).toBe(11);
  });
  it("12 месяцев — уже 1 год", () => {
    const a = calcAge(new Date(2025, 5, 1), ON);
    expect(a.totalMonths).toBe(12);
    expect(a.years).toBe(1);
  });
});

describe("adultGroup — группы 18–39 / 40+ / предпенсионная", () => {
  it("17 лет — диспансеризация взрослых не применяется", () => {
    expect(adultGroup(17, false)).toBe("under18");
  });
  it("18 и 39 лет — 1 раз в 3 года", () => {
    expect(adultGroup(18, false)).toBe("g18-39");
    expect(adultGroup(39, false)).toBe("g18-39");
  });
  it("40 лет без предпенсионного статуса — ежегодно, 1 рабочий день", () => {
    expect(adultGroup(40, false)).toBe("g40");
  });
  it("40+ лет с предпенсионным статусом — ежегодно, 2 рабочих дня", () => {
    expect(adultGroup(40, true)).toBe("g-prepens");
    expect(adultGroup(70, true)).toBe("g-prepens");
  });
});

describe("adultExamsFor — возрастные границы исследований", () => {
  const has = (age: number, sex: "m" | "f", id: string) =>
    adultExamsFor(age, sex, exams).some((e) => e.id === id);

  it("маммография: 48 — нет, 49 — да, 58 — да, 59 — нет", () => {
    expect(has(48, "f", "mammo")).toBe(false);
    expect(has(49, "f", "mammo")).toBe(true);
    expect(has(58, "f", "mammo")).toBe(true);
    expect(has(59, "f", "mammo")).toBe(false);
  });
  it("ПАП-тест: 21 год — да, 30 лет — нет (есть ВПЧ)", () => {
    expect(has(21, "f", "pap")).toBe(true);
    expect(has(30, "f", "pap")).toBe(false);
    expect(has(30, "f", "vpch")).toBe(true);
  });
  it("ПСА: только мужчины 50–65", () => {
    expect(has(50, "m", "psa")).toBe(true);
    expect(has(49, "m", "psa")).toBe(false);
    expect(has(66, "m", "psa")).toBe(false);
    expect(has(55, "f", "psa")).toBe(false);
  });
  it("внутриглазное давление — только с 40 лет", () => {
    expect(has(39, "m", "vgd")).toBe(false);
    expect(has(40, "m", "vgd")).toBe(true);
  });
  it("женские осмотры не выдаются мужчинам", () => {
    expect(has(30, "m", "smotrovaya")).toBe(false);
    expect(adultExamsFor(30, "m", exams).every((e) => e.pol !== "f")).toBe(true);
  });
  it("периодичность для 18–39 отличается от 40+", () => {
    const oak = (age: number) =>
      adultExamsFor(age, "m", exams).find((e) => e.id === "oak")!.kratnostForUser;
    expect(oak(25)).toBe("1 раз в 3 года");
    expect(oak(45)).toBe("1 раз в год");
  });
});

describe("childStage — границы детских групп", () => {
  it("11 месяцев — грудной возраст (Прил. 1)", () => {
    expect(childStage(calcAge(new Date(2025, 6, 1), ON))).toEqual({ kind: "infant" });
  });
  it("1 год ровно — колонка 1–2 года (Прил. 2)", () => {
    expect(childStage(calcAge(new Date(2025, 5, 1), ON))).toEqual({
      kind: "column",
      column: "1-2",
      colIndex: 0,
    });
  });
  it("10 лет — колонка 7–14 лет (ЭКГ «в 10 лет»)", () => {
    expect(childStage(calcAge(new Date(2016, 0, 15), ON))).toEqual({
      kind: "column",
      column: "7-14",
      colIndex: 2,
    });
  });
  it("17 лет — колонка 17; 18 лет — взрослый", () => {
    expect(childStage(calcAge(new Date(2008, 5, 2), ON))).toEqual({
      kind: "column",
      column: "17",
      colIndex: 5,
    });
    expect(childStage(calcAge(new Date(2008, 5, 1), ON))).toEqual({ kind: "adult" });
  });
});

describe("coveragePercent — калькулятор охвата (п. 15 № 174)", () => {
  it("95/100 = 95", () => expect(coveragePercent(95, 100)).toBe(95));
  it("189/200 = 94,5", () => expect(coveragePercent(189, 200)).toBe(94.5));
  it("нулевой знаменатель → null", () => expect(coveragePercent(10, 0)).toBeNull());
});

describe("ageLabelRu — человекочитаемый возраст", () => {
  it("склонение лет и месяцев", () => {
    expect(ageLabelRu({ years: 1, months: 1, totalMonths: 13, days: 0 })).toBe("1 год 1 месяц");
    expect(ageLabelRu({ years: 2, months: 3, totalMonths: 27, days: 0 })).toBe("2 года 3 месяца");
    expect(ageLabelRu({ years: 0, months: 11, totalMonths: 11, days: 0 })).toBe("11 месяцев");
  });
});
