import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  delta: number;
  series: number[];
  hint?: string;
};

export const StatCard = ({ label, value, delta, series, hint }: Props) => {
  const positive = delta >= 0;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const points = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * 100;
      const y = 30 - ((v - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
            positive ? "bg-secondary/15 text-secondary-foreground" : "bg-destructive/10 text-destructive",
          )}
          style={{ color: positive ? "hsl(var(--secondary))" : undefined }}
        >
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="font-display text-[28px] font-semibold leading-none">{value}</p>
      {hint && <p className="text-[12px] text-muted-foreground mt-1">{hint}</p>}
      <svg viewBox="0 0 100 32" className="mt-4 w-full h-10" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={positive ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
};
