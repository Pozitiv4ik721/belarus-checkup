import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Checklist } from "@/components/Checklist";
import { HealthGroups } from "@/components/HealthGroups";
import { Form3uDR } from "@/components/Form3uDR";
import { CoverageCalculator } from "@/components/CoverageCalculator";
import { RiskGroupsList } from "@/components/RiskGroupsList";
import { T } from "@/i18n/LangProvider";

export const metadata: Metadata = {
  title: "Для медработника: чек-лист, группы здоровья, карта 3/у-ДР, охват",
  description:
    "Практические инструменты по Инструкциям № 173 и № 174: чек-лист проведения (п. 8), группы здоровья I–IV (п. 9.1), карта учёта ф. 3/у-ДР (прил. 4, п. 13), калькулятор охвата (п. 15), факторы риска до 1 года (прил. 3).",
  alternates: { canonical: "/medrabotnikam" },
};

function Section({
  id,
  titleKey,
  noteKey,
  children,
}: {
  id: string;
  titleKey: string;
  noteKey?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24">
      <h2 id={`${id}-h`} className="h-section text-xl sm:text-2xl">
        <T k={titleKey} />
      </h2>
      {noteKey && (
        <p className="mt-2 max-w-3xl text-[0.98rem] text-muted">
          <T k={noteKey} />
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function MedPage() {
  return (
    <>
      <PageHeader titleKey="med.title" leadKey="med.lead" />
      <div className="container-site space-y-14 py-10">
        <Section id="checklist" titleKey="med.checklistTitle" noteKey="med.checklistNote">
          <Checklist />
        </Section>
        <Section id="health-groups" titleKey="med.groupsTitle">
          <HealthGroups />
        </Section>
        <Section id="card" titleKey="med.cardTitle">
          <Form3uDR />
        </Section>
        <Section id="coverage" titleKey="med.coverageTitle">
          <CoverageCalculator />
        </Section>
        <Section id="risk" titleKey="med.riskTitle" noteKey="child.riskNote">
          <RiskGroupsList />
        </Section>
      </div>
    </>
  );
}
