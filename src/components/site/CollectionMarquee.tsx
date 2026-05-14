import { Link } from "react-router-dom";
import { ALL_COLLECTIONS } from "@/lib/registry";
import { CollectionLogo } from "./CollectionLogo";

export const CollectionMarquee = () => {
  // Duplicate the list so the loop is seamless.
  const items = [...ALL_COLLECTIONS, ...ALL_COLLECTIONS];
  return (
    <section className="relative border-y border-white/5 bg-background/40 py-12">
      <div className="container text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          The Searchable Web
        </div>
        <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold tracking-tight">
          Channels &amp; archives, indexed end-to-end.
        </h2>
      </div>
      <div className="group relative mt-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
          {items.map((c, i) => (
            <Link
              key={`${c.key}-${i}`}
              to={`/collections/${c.key}`}
              aria-label={`Open ${c.name}`}
              className="group/item shrink-0 transition-all duration-300"
            >
              <CollectionLogo
                src={c.logo}
                alt={c.name}
                size="md"
                className="opacity-40 grayscale transition-all duration-300 group-hover/item:opacity-100 group-hover/item:grayscale-0 group-hover/item:shadow-[0_0_24px_2px_hsl(var(--sonar)/0.55)] group-hover/item:border-[hsl(var(--sonar)/0.6)]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};