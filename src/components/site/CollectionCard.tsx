import { Link } from "react-router-dom";
import { Collection } from "@/lib/registry";
import { CollectionLogo } from "./CollectionLogo";

export const CollectionCard = ({ collection }: { collection: Collection }) => {
  return (
    <Link
      to={`/collections/${collection.key}`}
      className="group flex flex-col items-center rounded-2xl border border-[#262626] bg-[#1C1C1C]/80 p-5 backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--sonar)/0.5)] hover:shadow-[0_0_32px_-4px_hsl(var(--sonar)/0.45)]"
    >
      <CollectionLogo
        src={collection.logo}
        alt={collection.name}
        size="lg"
        padding={collection.logoPadding}
        className="transition-shadow duration-300 group-hover:shadow-[0_0_24px_2px_hsl(var(--sonar)/0.55)]"
      />
      <h3 className="mt-4 text-center font-sans text-base font-bold text-white">
        {collection.shortName}
      </h3>
      <span className="mt-2 inline-flex rounded-full border border-[hsl(var(--sonar)/0.6)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sonar))]">
        {collection.episodeCount}
      </span>
    </Link>
  );
};