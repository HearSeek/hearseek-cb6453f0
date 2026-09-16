import { ClipboardPaste, AudioWaveform, Search } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Step 1 — Paste",
    body: "Paste your channel or playlist link.",
  },
  {
    icon: AudioWaveform,
    title: "Step 2 — We make it searchable",
    body: "We transcribe and index every spoken word, in any language.",
  },
  {
    icon: Search,
    title: "Step 3 — Search and jump",
    body: "Search by meaning and jump straight to the exact moment.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:pb-32" aria-label="How it works">
      <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
        How it works
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-[hsl(var(--sv-border))] bg-[hsl(var(--sv-surface))] p-6 shadow-[0_16px_40px_-24px_hsl(228_49%_4%/0.8)]"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--sv-violet)/0.15)]">
              <s.icon className="h-5 w-5 text-[hsl(var(--sv-violet))]" aria-hidden />
            </div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--sv-muted))]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
