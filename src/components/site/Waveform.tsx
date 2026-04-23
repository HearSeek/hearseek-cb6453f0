import { cn } from "@/lib/utils";

interface WaveformProps {
  className?: string;
  bars?: number;
  animated?: boolean;
}

export const Waveform = ({ className, bars = 32, animated = true }: WaveformProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-[3px] h-12", className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 20 + ((i * 37) % 80);
        return (
          <span
            key={i}
            className={cn(
              "w-[3px] rounded-full bg-gradient-waveform",
              animated && "animate-wave",
            )}
            style={{
              height: `${h}%`,
              animationDelay: `${(i % 8) * 0.08}s`,
            }}
          />
        );
      })}
    </div>
  );
};