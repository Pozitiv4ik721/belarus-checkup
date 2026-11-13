import Link from "next/link";
import {
  ArrowRight,
  Baby,
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileText,
  ListChecks,
  Printer,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { T } from "@/i18n/LangProvider";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="brand-grad border-b border-brand-100">
        <div className="container-site grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="chip chip-source mb-5">
              <ShieldCheck className="size-3.5" aria-hidden />
              <T k="home.heroTrust" />
            </p>
            <h1 className="h-display text-[2rem] leading-[1.08] sm:text-[2.9rem]">
              <T k="home.heroTitle" />
            </h1>
            <p className="lead mt-5 max-w-2xl">
              <T k="home.heroLead" />
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/vzroslym" className="btn-primary">
                <UserRound className="size-5" aria-hidden />
                <T k="home.heroCtaAdult" />
              </Link>
              <Link href="/roditelyam" className="btn-ghost">
                <Baby className="size-5" aria-hidden />
                <T k="home.heroCtaChild" />
              </Link>
            </div>
          </div>

          <div className="deco grid grid-cols-2 gap-3" aria-hidden>
            {[
              { icon: CalendarDays, t: "home.fact1t", d: "home.fact1d", span: false },
              { icon: ClipboardList, t: "home.fact2t", d: "home.fact2d", span: false },
              { icon: Baby, t: "home.fact3t", d: "home.fact3d", span: false },
              { icon: BarChart3, t: "home.fact4t", d: "home.fact4d", span: false },
            ].map(({ icon: Icon, t, d: dk }) => (
              <div key={t} className="card page-break-avoid p-4">
                <Icon className="size-5 text-brand-700" />
                <p className="mt-2 text-[1.02rem] font-bold leading-tight text-brand-950">
                  <T k={t} />
                </p>
                <p className="mt-1 text-[0.85rem] leading-snug text-muted">
                  <T k={dk} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Аудитории */}
      <section className="container-site py-12 sm:py-16" aria-labelledby="aud">
        <h2 id="aud" className="h-section text-2xl sm:text-3xl">
          <T k="home.audiencesTitle" />
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            { href: "/vzroslym", icon: UserRound, t: "home.cardAdultTitle", d: "home.cardAdultText" },
            { href: "/roditelyam", icon: Baby, t: "home.cardChildTitle", d: "home.cardChildText" },
            { href: "/medrabotnikam", icon: Stethoscope, t: "home.cardMedTitle", d: "home.cardMedText" },
          ].map(({ href, icon: Icon, t, d: dk }) => (
            <Link
              key={href}
              href={href}
              className="card group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="mt-4 text-xl font-bold tracking-tight text-brand-950">
                <T k={t} />
              </span>
              <span className="mt-2 text-[0.98rem] leading-relaxed text-muted">
                <T k={dk} />
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-700">
                <T k="home.go" />
                <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Шаги */}
      <section className="border-y border-brand-100 bg-white">
        <div className="container-site py-12 sm:py-16" aria-labelledby="steps">
          <h2 id="steps" className="h-section text-2xl sm:text-3xl">
            <T k="home.stepsTitle" />
          </h2>
          <ol className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              { icon: CalendarDays, t: "home.step1t", d: "home.step1d" },
              { icon: ListChecks, t: "home.step2t", d: "home.step2d" },
              { icon: Printer, t: "home.step3t", d: "home.step3d" },
            ].map(({ icon: Icon, t, d: dk }, i) => (
              <li key={t} className="card-flat relative p-6">
                <span className="absolute right-5 top-4 text-4xl font-black text-brand-100 deco" aria-hidden>
                  {i + 1}
                </span>
                <Icon className="size-6 text-brand-700" aria-hidden />
                <p className="mt-3 text-lg font-bold text-brand-950">
                  <T k={t} />
                </p>
                <p className="mt-1.5 text-[0.97rem] leading-relaxed text-muted">
                  <T k={dk} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Документы */}
      <section className="container-site py-12 sm:py-16">
        <div className="card flex flex-wrap items-center justify-between gap-5 bg-brand-950 p-6 text-white sm:p-8">
          <div className="max-w-xl">
            <h2 className="flex items-center gap-2.5 text-xl font-bold sm:text-2xl">
              <FileText className="size-6 text-brand-300" aria-hidden />
              <T k="home.docsStripTitle" />
            </h2>
            <p className="mt-2 text-brand-100/90">
              <T k="home.docsStripText" />
            </p>
          </div>
          <Link
            href="/dokumenty"
            className="btn-ghost border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20 hover:text-white"
          >
            <T k="home.docsStripCta" />
            <ArrowRight className="size-4.5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
