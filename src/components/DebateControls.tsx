import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftRight, Play, Square, Rocket } from "lucide-react";

interface DebateControlsProps {
  maxTurns: number;
  onMaxTurnsChange: (value: number) => void;
  splitView: boolean;
  onSplitViewChange: (checked: boolean) => void;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onSwap: () => void;
  canStart: boolean;
}

export const DebateControls = ({
  maxTurns,
  onMaxTurnsChange,
  splitView,
  onSplitViewChange,
  isRunning,
  onStart,
  onStop,
  onSwap,
  canStart,
}: DebateControlsProps) => {
  return (
    <Card
      id="debate-controls"
      className="glass-effect flex flex-col gap-6 p-6 transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Debate flow</h2>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Configure cadence, layout, and orchestration
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/10">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
            Live
          </span>
          <span className="hidden sm:block">|</span>
          <span>Adaptive streaming</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-4 rounded-2xl border border-white/20 bg-white/60 p-5 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
          <Label htmlFor="maxTurns" className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Max turns
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="maxTurns"
              type="number"
              value={maxTurns}
              onChange={(event) => onMaxTurnsChange(parseInt(event.target.value, 10) || 20)}
              min={1}
              max={100}
              className="max-w-[120px] text-center font-mono"
            />
            <span className="text-sm text-muted-foreground">Each response counts as one turn.</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/50 px-3 py-2 shadow-inner backdrop-blur dark:bg-white/10">
            <Checkbox id="splitView" checked={splitView} onCheckedChange={onSplitViewChange} />
            <Label htmlFor="splitView" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Mirror transcripts side by side
            </Label>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={onStart}
            disabled={!canStart || isRunning}
            variant="hero"
            size="lg"
            className="flex-1"
          >
            <Rocket className="h-5 w-5" />
            Start debate
          </Button>
          <Button
            onClick={onSwap}
            variant="swap"
            size="lg"
            title="Swap prompts, models, and parameters"
            className="flex-1"
          >
            <ArrowLeftRight className="h-5 w-5" />
            Swap sides
          </Button>
          <Button
            onClick={onStop}
            disabled={!isRunning}
            variant="stop"
            size="lg"
            className="flex-1"
          >
            {isRunning ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            Stop
          </Button>
        </div>
      </div>

      {!canStart && (
        <div className="rounded-2xl border border-dashed border-white/30 bg-white/40 px-4 py-3 text-center text-sm text-muted-foreground shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
          Add at least one OpenRouter API key and assign models to both participants to launch the debate.
        </div>
      )}
    </Card>
  );
};
