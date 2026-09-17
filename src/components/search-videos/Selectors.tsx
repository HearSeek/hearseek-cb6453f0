import { hs } from "@/lib/persona-analytics";
import { cn } from "@/lib/utils";

export type Usecase =
  | "youtube_channel"
  | "podcast"
  | "interviews"
  | "lectures"
  | "work_recordings"
  | "other";
export type SizeBand = "<5" | "5-50" | "51-100" | "101-500" | "501+";

const USECASES: { label: string; value: Usecase }[] = [
  { label: "My YouTube channel", value: "youtube_channel" },
  { label: "Podcast", value: "podcast" },
  { label: "Research interviews", value: "interviews" },
  { label: "Course / lectures", value: "lectures" },
  { label: "Work recordings", value: "work_recordings" },
  { label: "Other", value: "other" },
];

const BANDS: { label: string; value: SizeBand }[] = [
  { label: "Under 5 hours", value: "<5" },
  { label: "5–50", value: "5-50" },
  { label: "51–100", value: "51-100" },
  { label: "101–500", value: "101-500" },
  { label: "501+", value: "501+" },
];

const chipClass = (active: boolean) =>
  cn(
    "rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200",
    active
      ? "sv-grad-btn border-transparent text-[hsl(228_49%_8%)] shadow-[0_8px_24px_-8px_hsl(256_100%_65%/0.6)]"
      : "border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] text-[hsl(var(--sv-muted))] hover:border-[hsl(var(--sv-violet)/0.5)] hover:text-[hsl(var(--sv-fg))]",
  );

export function Selectors({
  usecases,
  onUsecases,
  sizeBand,
  onSizeBand,
}: {
  usecases: Usecase[];
  onUsecases: (usecases: Usecase[]) => void;
  sizeBand: SizeBand | null;
  onSizeBand: (b: SizeBand) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-24 md:pb-32" aria-label="Tell us about your content">
      <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
        What do you want to search?
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3" role="group" aria-label="What do you want to search?">
        {USECASES.map((u) => (
          <button
            key={u.value}
            type="button"
            aria-pressed={usecases.includes(u.value)}
            className={chipClass(usecases.includes(u.value))}
            onClick={() => {
              const nextUsecases = usecases.includes(u.value)
                ? usecases.filter((value) => value !== u.value)
                : [...usecases, u.value];
              onUsecases(nextUsecases);
              hs("hs_usecase_select", { usecases: nextUsecases });
            }}
          >
            {u.label}
          </button>
        ))}
      </div>

      <h2 className="mt-16 text-center text-2xl font-bold tracking-tight md:text-3xl">
        How much content?
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3" role="group" aria-label="How much content?">
        {BANDS.map((b) => (
          <button
            key={b.value}
            type="button"
            aria-pressed={sizeBand === b.value}
            className={chipClass(sizeBand === b.value)}
            onClick={() => {
              onSizeBand(b.value);
              hs("hs_archive_size", { size_band: b.value });
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
    </section>
  );
}
