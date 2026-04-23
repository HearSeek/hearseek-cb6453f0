import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoEmbedProps {
  src?: string;
  title?: string;
  className?: string;
  label?: string;
}

export const VideoEmbed = ({ src, title = "Demo video", className, label = "Demo video coming soon" }: VideoEmbedProps) => {
  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-2xl border border-border/60 bg-gradient-card shadow-elegant",
        className,
      )}
    >
      {src ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <button
            type="button"
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-waveform glow-primary animate-pulse-glow transition-transform hover:scale-105"
            aria-label="Play demo"
          >
            <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
          </button>
          <p className="relative z-10 text-sm text-muted-foreground">{label}</p>
        </div>
      )}
    </div>
  );
};