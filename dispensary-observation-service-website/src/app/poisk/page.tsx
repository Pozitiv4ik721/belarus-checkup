import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Поиск по сайту",
  description: "Поиск по материалам сервиса «Диспансеризация в Беларуси» — работает в браузере, запросы не отправляются на сервер.",
  alternates: { canonical: "/poisk" },
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <>
      <PageHeader titleKey="searchPage.title" leadKey="searchPage.lead" note={false} />
      <div className="container-site py-10">
        <SearchClient />
      </div>
    </>
  );
}
