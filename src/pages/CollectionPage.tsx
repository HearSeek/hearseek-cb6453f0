import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Search, Play, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/hearseek-logo-mark-white.png";
import { youtubeThumbnail } from "@/lib/hearseek";
import { getCollection, tierLabel } from "@/lib/registry";
import { CollectionLogo } from "@/components/site/CollectionLogo";
import { SEO } from "@/components/site/SEO";
import { trackEvent } from "@/lib/analytics";

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = getCollection(slug);
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!collection) return <Navigate to="/" replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    trackEvent("collection_view", {
      collection_key: collection.key,
      collection_name: collection.name,
    });
  }, [collection.key, collection.name]);

  const submitQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    trackEvent("collection_search", {
      collection_key: collection.key,
      query_length: trimmed.length,
    });
    const params = new URLSearchParams({ q: trimmed });
    navigate(`/collections/${collection.key}/results?${params.toString()}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(value);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <SEO
        title={`${collection.shortName} — Search the Archive on HearSeek`}
        description={collection.tagline}
        path={`/collections/${collection.key}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.name,
          description: collection.tagline,
          url: `https://hearseek.com/collections/${collection.key}`,
          isPartOf: {
            "@type": "WebSite",
            name: "HearSeek",
            url: "https://hearseek.com",
          },
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute left-1/2 top-[38%] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-waveform opacity-[0.18] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 pt-6 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to HearSeek</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <Link to="/" className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <img src={logoMark} alt="HearSeek logo" className="h-[35px] w-[35px] object-contain" />
            <span className="font-display text-sm font-semibold tracking-tight md:text-base">HearSeek</span>
          </div>
          <span className="hidden text-[10px] text-muted-foreground md:block">
            The World's First AI Search Engine for Audio
          </span>
        </Link>
        <div className="w-[60px] sm:w-[140px]" />
      </div>

      <main className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-5 py-12 md:px-8">
        <span className="inline-flex items-center rounded-full border border-[hsl(var(--sonar)/0.6)] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sonar))]">
          {tierLabel(collection.tier)}
        </span>
        {collection.logo && (
          <CollectionLogo
            src={collection.logo}
            alt={`${collection.name} logo`}
            size="xl"
            className="mt-5"
          />
        )}
        <h1 className="mt-5 text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
          {collection.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground">
          {collection.tagline}
        </p>

        <form onSubmit={onSubmit} className="mt-8 w-full max-w-2xl">
          <div
            className={cn(
              "relative flex items-center gap-2 rounded-2xl border bg-card/60 px-3 py-3 backdrop-blur-xl transition-colors duration-300 md:gap-3 md:px-4 md:py-3.5",
              "border-white/10 search-halo",
              focused && "search-halo-active",
            )}
          >
            <Search className="h-5 w-5 shrink-0 text-primary" />
            <input
              ref={inputRef}
              type="text"
              aria-label={`Search ${collection.shortName}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={`Search ${collection.shortName}...`}
              className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-sm text-foreground outline-none ring-0 shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 md:text-base"
              style={{ boxShadow: "none", outline: "none" }}
            />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-normal text-white/70">
            {collection.disclaimer}
          </p>

          {collection.suggestions.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {collection.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setValue(s);
                    submitQuery(s);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-white/10 hover:text-foreground md:text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </form>

        {collection.featuredVideoIds.length > 0 && (
          <section className="mt-16 w-full">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Featured</div>
                <h2 className="mt-1 font-display text-xl font-semibold md:text-2xl">
                  Highlights from the archive
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {collection.featuredVideoIds.map((id) => (
                <a
                  key={id}
                  href={`https://www.youtube.com/watch?v=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-xl border border-white/10 bg-card/40 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
                >
                  <div className="relative aspect-video">
                    <img
                      src={youtubeThumbnail(id)}
                      alt="Featured video thumbnail"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-background/10 transition group-hover:bg-background/20" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-waveform shadow-elegant">
                        <Play className="ml-0.5 h-5 w-5 text-white" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <p className="relative mb-6 text-center text-xs text-muted-foreground/70">
        HearSeek can make mistakes. Check important info.
      </p>
    </div>
  );
};

export default CollectionPage;