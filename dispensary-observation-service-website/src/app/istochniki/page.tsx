import type { Metadata } from "next";
import { AlertTriangle, ExternalLink, History } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { T } from "@/i18n/LangProvider";
import { collectNeedsVerification, DOCUMENTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Источники и изменения",
  description:
    "Правовая база сервиса: постановления Минздрава № 173 и № 174 от 16.12.2024 (в силе с 01.01.2025), редакция постановления № 13 от 26.02.2026 (в силе с 23.05.2026), заменённое постановление № 125. Перечень позиций на сверке.",
  alternates: { canonical: "/istochniki" },
};

export default function SourcesPage() {
  const check = collectNeedsVerification();
  return (
    <>
      <PageHeader titleKey="sourcesPage.title" leadKey="sourcesPage.lead" />
      <div className="container-site space-y-14 py-10">
        <section aria-labelledby="timeline">
          <h2 id="timeline" className="h-section flex items-center gap-2.5 text-xl sm:text-2xl">
            <History className="size-6 text-brand-700" aria-hidden />
            <T k="sourcesPage.timelineTitle" />
          </h2>
          <div className="card mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/60">
                  <th className="px-4 py-3 font-bold text-brand-900"><T k="sourcesPage.th1" /></th>
                  <th className="px-4 py-3 font-bold text-brand-900"><T k="sourcesPage.th2" /></th>
                  <th className="px-4 py-3 font-bold text-brand-900"><T k="sourcesPage.th3" /></th>
                </tr>
              </thead>
              <tbody>
                {DOCUMENTS.map((doc) => (
                  <tr key={doc.id} className="border-b border-brand-50 align-top last:border-0">
                    <td className="px-4 py-3.5 text-[0.97rem] font-medium leading-snug text-ink">
                      {doc.title_ru}
                    </td>
                    <td className="px-4 py-3.5 text-[0.92rem] leading-snug text-muted">
                      {doc.status_ru}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        {doc.links.map((l) => (
                          <a
                            key={l.url + l.label}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[0.9rem] font-semibold text-brand-700 hover:underline"
                          >
                            {l.label}
                            <ExternalLink className="size-3" aria-hidden />
                          </a>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="actual">
          <h2 id="actual" className="h-section text-xl sm:text-2xl">
            <T k="sourcesPage.actualTitle" />
          </h2>
          <p className="card-flat mt-4 max-w-3xl p-5 text-[1.02rem] leading-relaxed">
            <T k="sourcesPage.actualText" />
          </p>
        </section>

        <section aria-labelledby="checklist-verify">
          <h2 id="checklist-verify" className="h-section flex items-center gap-2.5 text-xl sm:text-2xl">
            <AlertTriangle className="size-6 text-amber-600" aria-hidden />
            <T k="sourcesPage.checkListTitle" />
          </h2>
          <p className="mt-2 max-w-3xl text-[0.98rem] text-muted">
            <T k="sourcesPage.checkListNote" />
          </p>
          <div className="card mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-brand-100 bg-amber-50/70">
                  <th className="px-4 py-3 font-bold text-brand-900"><T k="sourcesPage.colItem" /></th>
                  <th className="px-4 py-3 font-bold text-brand-900"><T k="sourcesPage.colSource" /></th>
                  <th className="px-4 py-3 font-bold text-brand-900"><T k="sourcesPage.colNote" /></th>
                </tr>
              </thead>
              <tbody>
                {check.map((c) => (
                  <tr key={c.id} className="border-b border-brand-50 align-top last:border-0">
                    <td className="px-4 py-3">
                      <span className="block text-[0.92rem] text-muted">{c.section}</span>
                      <span className="text-[0.97rem] font-medium leading-snug text-ink">{c.name}</span>
                    </td>
                    <td className="px-4 py-3 text-[0.92rem] leading-snug text-muted">{c.istochnik}</td>
                    <td className="px-4 py-3 text-[0.92rem] leading-snug text-muted">
                      {c.primechanie || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
