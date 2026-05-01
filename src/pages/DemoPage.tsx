import { useEffect, useRef, useState } from "react";
import { Search, Newspaper, Mic, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/hearseek-logo-mark.png";

type Scope = "news" | "podcasts";

const SCOPES: { id: Scope; label: string; icon: typeof Newspaper }[] = [
  { id: "news", label: "News Channels", icon: Newspaper },
  { id: "podcasts", label: "Podcasts", icon: Mic },
];

const PLACEHOLDERS = [
  "Ask HearSeek to search across hundreds of broadcasts...",
  "Ask HearSeek to find specific insights in podcasts...",
  "Ask HearSeek to analyze news coverage on any topic...",
];

// Typing-animation placeholder
const useTypingPlaceholder = (phrases: string[], active: boolean) => {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        setText(current.slice(0, charIdx));
        if (charIdx === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1800);
          return;
        }
      } else {
        charIdx--;
        setText(current.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      timer = setTimeout(tick, deleting ? 25 : 45);
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [phrases, active]);
  return text;
};

const DemoPage = () => {
  const [scope, setScope] = useState<Scope>("news");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placeholder = useTypingPlaceholder(PLACEHOLDERS, value.length === 0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setScopeOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const ActiveIcon = SCOPES.find((s) => s.id === scope)!.icon;
  const activeLabel = SCOPES.find((s) => s.id === scope)!.label;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient mesh gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-[38%] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-waveform opacity-[0.18] blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 md:px-8">
        {/* Logo */}
        <div
          className="mb-3 flex items-center justify-center rounded-full"
          style={{
            width: 96,
            height: 96,
            background:
              "radial-gradient(circle at center, hsl(258 90% 35% / 0.55) 0%, hsl(230 25% 6%) 70%)",
          }}
        >
          <img
            src={logoMark}
            alt="HearSeek"
            className="h-[70px] w-[70px] object-contain drop-shadow-[0_0_28px_hsl(var(--primary)/0.6)] md:h-[88px] md:w-[88px]"
          />
        </div>
        <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          The World's First AI Search Engine for Audio
        </p>
        <h1 className="mb-10 text-center font-display text-2xl font-semibold tracking-tight md:text-3xl">
          What would you like to find today?
        </h1>

        {/* Hero search */}
        <div className="w-full">
          <div className="relative">
            <div
              aria-hidden
              className={cn(
                "absolute -inset-[2px] rounded-2xl bg-gradient-waveform blur-md transition-opacity duration-300",
                focused ? "opacity-70" : "opacity-0",
              )}
            />
            <div
              className={cn(
                "relative flex items-center gap-2 rounded-2xl border border-white/10 bg-card/60 px-3 py-3 backdrop-blur-xl transition md:gap-3 md:px-4 md:py-3.5",
                focused && "ring-1 ring-primary/40",
              )}
            >
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none md:text-base"
              />

              {/* Integrated scope dropdown */}
              <div ref={dropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setScopeOpen((o) => !o)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition hover:border-primary/40 hover:bg-white/10 md:text-sm",
                    scopeOpen && "border-primary/40 bg-white/10",
                  )}
                >
                  <ActiveIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">{activeLabel}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition", scopeOpen && "rotate-180")} />
                </button>
                {scopeOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-52 overflow-hidden rounded-xl border border-white/10 bg-popover/95 p-1 shadow-elegant backdrop-blur-xl animate-fade-in">
                    {SCOPES.map((s) => {
                      const Icon = s.icon;
                      const active = s.id === scope;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setScope(s.id);
                            setScopeOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
                            active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="flex-1">{s.label}</span>
                          {active && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground/80">
            Search across hundreds of {activeLabel.toLowerCase()} — by meaning, not just keywords.
          </p>
        </div>
      </main>

      <p className="relative mb-6 text-center text-xs text-muted-foreground/70">
        HearSeek can make mistakes. Check important info.
      </p>
    </div>
  );
};

export default DemoPage;
