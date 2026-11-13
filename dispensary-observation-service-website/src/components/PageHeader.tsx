import { T } from "@/i18n/LangProvider";

export function PageHeader({
  titleKey,
  leadKey,
  note = true,
}: {
  titleKey: string;
  leadKey: string;
  note?: boolean;
}) {
  return (
    <div className="brand-grad border-b border-brand-100">
      <div className="container-site py-10 sm:py-14">
        <h1 className="h-display max-w-4xl text-[1.7rem] sm:text-[2.4rem]">
          <T k={titleKey} />
        </h1>
        <p className="lead mt-4 max-w-3xl">
          <T k={leadKey} />
        </p>
        {note && (
          <p className="chip chip-source mt-5">
            <T k="common.updatedNote" />
          </p>
        )}
      </div>
    </div>
  );
}
