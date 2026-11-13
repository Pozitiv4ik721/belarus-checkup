"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { SEARCH_INDEX } from "@/lib/searchIndex";

function norm(s: string) {
  return s.toLowerCase().replace(/ё/g, "е");
}

export function SearchClient() {
  const { lang, d } = useLang();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = norm(q.trim());
    if (query.length < 2) return [];
    const words = query.split(/\s+/);
    return SEARCH_INDEX.filter((doc) => {
      const hay = norm(`${doc.title_ru} ${doc.text_ru} ${doc.title_be}`);
      return words.every((w) => hay.includes(w));
    });
  }, [q]);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="card flex items-center gap-3 p-3 sm:p-4"
      >
        <Search className="ml-1 size-5.5 shrink-0 text-brand-700" aria-hidden />
        <label htmlFor="site-search" className="sr-only">
          {d.searchPage.title}
        </label>
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={d.searchPage.placeholder}
          className="w-full bg-transparent text-lg outline-none placeholder:text-muted/70"
          autoFocus
        />
      </form>

      {q.trim().length >= 2 && (
        <p className="mt-4 text-[0.95rem] text-muted" aria-live="polite">
          {d.searchPage.results}: {results.length}
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {results.map((r) => (
          <li key={r.id}>
            <Link
              href={r.url}
              className="card-flat group flex items-center justify-between gap-3 p-4 transition-colors hover:border-brand-400 sm:p-5"
            >
              <span className="min-w-0">
                <span className="chip chip-source mb-1.5">
                  {lang === "be" ? r.section_be : r.section_ru}
                </span>
                <span className="block text-[1.05rem] font-semibold text-brand-950 group-hover:underline">
                  {lang === "be" ? r.title_be : r.title_ru}
                </span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-brand-600" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {q.trim().length >= 2 && results.length === 0 && (
        <p className="card-flat mt-4 p-5 text-muted">{d.searchPage.nothing}</p>
      )}
    </div>
  );
}
