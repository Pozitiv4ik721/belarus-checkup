"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ru, type Dict } from "./ru";
import { be } from "./be";

export type Lang = "ru" | "be";
const dicts: Record<Lang, Dict> = { ru, be };

interface LangCtxValue {
  lang: Lang;
  d: Dict;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<LangCtxValue>({ lang: "ru", d: ru, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lang");
      if (saved === "be" || saved === "ru") {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("lang", l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
  };

  return <LangCtx.Provider value={{ lang, d: dicts[lang], setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

/** Текстовый узел, переключающийся между языками (SSR — русский). */
export function T({ k }: { k: string }) {
  const { d } = useLang();
  let cur: unknown = d;
  for (const part of k.split(".")) {
    if (cur && typeof cur === "object") cur = (cur as Record<string, unknown>)[part];
    else return <>{k}</>;
  }
  return <>{typeof cur === "string" ? cur : k}</>;
}
