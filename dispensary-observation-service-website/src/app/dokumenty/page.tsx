import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { DocumentsList } from "@/components/DocumentsList";

export const metadata: Metadata = {
  title: "Тексты документов — официальные источники",
  description:
    "Ссылки на официальные тексты постановлений Минздрава № 173 и № 174 (ред. № 13 от 26.02.2026), постановления № 87, Трудового кодекса и Закона № 99-З: etalonline.by, pravo.by, minzdrav.gov.by.",
  alternates: { canonical: "/dokumenty" },
};

export default function DocsPage() {
  return (
    <>
      <PageHeader titleKey="docsPage.title" leadKey="docsPage.lead" />
      <div className="container-site py-10">
        <DocumentsList />
      </div>
    </>
  );
}
