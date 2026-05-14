import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE: Record<Size, string> = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-40 w-40",
};

/**
 * Uniform 20% padding frame for collection logos & headshots.
 * `inset-[10%]` on each side = 20% total horizontal/vertical breathing room.
 */
export const CollectionLogo = ({
  src,
  alt,
  size = "md",
  className,
  innerClassName,
}: {
  src?: string;
  alt: string;
  size?: Size;
  className?: string;
  innerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-2xl bg-[#1C1C1C] border border-[#262626]",
        SIZE[size],
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={cn("h-full w-full object-contain", innerClassName)}
          />
        ) : (
          <div className="h-full w-full rounded-md bg-white/5" aria-hidden />
        )}
      </div>
    </div>
  );
};