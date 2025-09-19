import { Card } from "@/components/ui/card";
import { Coins, MessagesSquare, Timer } from "lucide-react";

interface DebateStatsProps {
  lastLatency: number | null;
  tokens: { ai1: number; ai2: number };
  cost: { ai1: number; ai2: number; total: number };
}

const StatTile = ({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Timer;
  label: string;
  value: string;
  description: string;
}) => (
  <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-pink-500 text-white shadow-[0_16px_40px_rgba(79,70,229,0.35)]">
      <Icon className="h-5 w-5" />
    </span>
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const DebateStats = ({ lastLatency, tokens, cost }: DebateStatsProps) => {
  return (
    <Card className="glass-effect p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatTile
          icon={Timer}
          label="Latency"
          value={lastLatency ? `${lastLatency} ms` : "–"}
          description="Time elapsed since the last AI reply"
        />
        <StatTile
          icon={MessagesSquare}
          label="Tokens"
          value={`${tokens.ai1.toLocaleString()} / ${tokens.ai2.toLocaleString()}`}
          description="Approximate completion tokens for AI 1 and AI 2"
        />
        <StatTile
          icon={Coins}
          label="Cost"
          value={`$${cost.ai1.toFixed(3)} / $${cost.ai2.toFixed(3)} / $${cost.total.toFixed(3)}`}
          description="Prompt + completion cost estimates for each side"
        />
      </div>
    </Card>
  );
};
