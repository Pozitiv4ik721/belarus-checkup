import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ChildPlan } from "@/components/ChildPlan";

export const metadata: Metadata = {
  title: "Диспансеризация ребёнка (0–17 лет)",
  description:
    "Осмотры и исследования по возрасту ребёнка по Инструкции № 174: приложение 1 (до 1 года), приложение 2 (1–17 лет), приложение 3 (факторы риска). Сноски про оформление в сад и школу, напоминание про месяц рождения.",
  alternates: { canonical: "/roditelyam" },
};

export default function KidsPage() {
  return (
    <>
      <PageHeader titleKey="child.title" leadKey="child.lead" />
      <div className="container-site py-10">
        <ChildPlan />
      </div>
    </>
  );
}
