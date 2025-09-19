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
    <Card className="glass-effect">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="maxTurns" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Max Turns:
              </Label>
              <Input
                id="maxTurns"
                type="number"
                value={maxTurns}
                onChange={(e) => onMaxTurnsChange(parseInt(e.target.value) || 20)}
                min={1}
                max={100}
                className="w-20 font-mono text-center"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="splitView"
                checked={splitView}
                onCheckedChange={onSplitViewChange}
              />
              <Label htmlFor="splitView" className="text-sm font-medium text-muted-foreground">
                Split View
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={onStart}
              disabled={!canStart || isRunning}
              variant="hero"
              size="lg"
              className="flex-1 lg:flex-none"
            >
              <Rocket className="w-4 h-4" />
              Start Debate
            </Button>
            
            <Button
              onClick={onSwap}
              variant="swap"
              size="lg"
              title="Swap prompts, models, and parameters"
              className="flex-1 lg:flex-none"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap Sides
            </Button>
            
            <Button
              onClick={onStop}
              disabled={!isRunning}
              variant="stop"
              size="lg"
              className="flex-1 lg:flex-none"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
          </div>
        </div>

        {!canStart && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Please add API keys and select models to start the debate.
          </div>
        )}
      </div>
    </Card>
  );
};