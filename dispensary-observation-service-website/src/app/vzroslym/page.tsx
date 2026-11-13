import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { AdultRoute } from "@/components/AdultRoute";

export const metadata: Metadata = {
  title: "Мой маршрут диспансеризации (взрослые 18+)",
  description:
    "Персональный перечень обследований по Инструкции № 173: группа 18–39 или 40+, периодичность, длительность (1–2 рабочих дня) и список исследований с кратностью. Версия для печати. Данные не покидают браузер.",
  alternates: { canonical: "/vzroslym" },
};

export default function AdultsPage() {
  return (
    <>
      <PageHeader titleKey="adult.title" leadKey="adult.lead" />
      <div className="container-site py-10">
        <AdultRoute />
      </div>
    </>
  );
}
