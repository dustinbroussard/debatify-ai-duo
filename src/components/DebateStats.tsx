import { Card } from "@/components/ui/card";

interface DebateStatsProps {
  lastLatency: number | null;
  tokens: { ai1: number; ai2: number };
  cost: { ai1: number; ai2: number; total: number };
}

export const DebateStats = ({ lastLatency, tokens, cost }: DebateStatsProps) => {
  return (
    <Card className="glass-effect">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Last Response:</span>
            <span className="font-mono font-semibold">
              {lastLatency ? `${lastLatency}ms` : "–"}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-muted-foreground">Tokens AI1/AI2:</span>
            <span className="font-mono font-semibold">
              {tokens.ai1} / {tokens.ai2}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-muted-foreground">Approx Cost $ AI1/AI2/Total:</span>
            <span className="font-mono font-semibold">
              {cost.ai1.toFixed(3)} / {cost.ai2.toFixed(3)} / {cost.total.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};