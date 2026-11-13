import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FaqList } from "@/components/FaqList";

export const metadata: Metadata = {
  title: "Частые вопросы о диспансеризации",
  description:
    "Где проходить диспансеризацию, что делать при выявлении заболевания, справки и выписки (постановление № 87), гарантии по Трудовому кодексу, защита персональных данных (Закон № 99-З).",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHeader titleKey="faqPage.title" leadKey="faqPage.lead" />
      <div className="container-site max-w-4xl py-10">
        <FaqList />
      </div>
    </>
  );
}
