import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEBATE_PRESETS } from "@/constants/debate-presets";

interface DebatePresetsProps {
  selectedPreset: string;
  onPresetChange: (value: string) => void;
  onApplyPreset: () => void;
}

export const DebatePresets = ({ selectedPreset, onPresetChange, onApplyPreset }: DebatePresetsProps) => {
  return (
    <Card className="glass-effect transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0 space-y-2">
          <Label htmlFor="presetSelect" className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Debate Presets
          </Label>
          <Select value={selectedPreset} onValueChange={onPresetChange}>
            <SelectTrigger id="presetSelect" className="w-full rounded-2xl border-white/30 bg-white/60 text-left text-sm shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/10">
              <SelectValue placeholder="Select a debate preset..." />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/20 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#111a34]/90">
              {Object.entries(DEBATE_PRESETS).map(([key, preset]) => (
                <SelectItem key={key} value={key} className="rounded-xl text-sm">
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Load curated personas and arguments instantly. Customize them further to craft nuanced debates.
          </p>
        </div>

        <Button
          onClick={onApplyPreset}
          variant="outline"
          disabled={selectedPreset === "custom"}
          className="h-12 w-full rounded-2xl border-white/40 bg-white/40 text-sm font-semibold uppercase tracking-[0.2em] text-foreground shadow-inner backdrop-blur hover:bg-white/70 dark:border-white/10 dark:bg-white/10 sm:w-auto"
        >
          Apply preset
        </Button>
      </div>
    </Card>
  );
};
