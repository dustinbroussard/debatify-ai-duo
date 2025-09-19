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

export const DebatePresets = ({
  selectedPreset,
  onPresetChange,
  onApplyPreset,
}: DebatePresetsProps) => {
  return (
    <Card className="glass-effect">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Label htmlFor="presetSelect" className="text-sm font-medium text-muted-foreground mb-2 block">
              Debate Presets:
            </Label>
            <Select value={selectedPreset} onValueChange={onPresetChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a debate preset..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DEBATE_PRESETS).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={onApplyPreset}
            variant="secondary"
            disabled={selectedPreset === "custom"}
            className="mt-6 sm:mt-0"
          >
            Apply Preset
          </Button>
        </div>
      </div>
    </Card>
  );
};
