interface StatCardProps {
  value: string;
  label: string;
  sub?: string;
}

export const StatCard = ({ value, label, sub }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-card p-6 text-center">
      <div className="font-display text-3xl md:text-4xl font-bold text-gradient">{value}</div>
      <div className="mt-2 text-sm font-medium text-foreground">{label}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
};