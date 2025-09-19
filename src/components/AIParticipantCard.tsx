import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface AIParticipantCardProps {
  participantNumber: 1 | 2;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  selectedModel: string;
  onModelChange: (value: string) => void;
  showFreeOnly: boolean;
  onShowFreeOnlyChange: (checked: boolean) => void;
  temperature: number;
  onTemperatureChange: (value: number[]) => void;
  maxTokens: number;
  onMaxTokensChange: (value: number) => void;
  topP: number;
  onTopPChange: (value: number[]) => void;
  frequencyPenalty: number;
  onFrequencyPenaltyChange: (value: number[]) => void;
  models: Array<{ id: string; name: string; pricing?: { prompt: number; completion: number } }>;
}

export const AIParticipantCard = ({
  participantNumber,
  systemPrompt,
  onSystemPromptChange,
  selectedModel,
  onModelChange,
  showFreeOnly,
  onShowFreeOnlyChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  topP,
  onTopPChange,
  frequencyPenalty,
  onFrequencyPenaltyChange,
  models,
}: AIParticipantCardProps) => {
  const isAI1 = participantNumber === 1;
  const gradientAccent = isAI1 ? "from-cyan-400/90 via-sky-500/90 to-indigo-500/90" : "from-pink-400/90 via-rose-500/90 to-violet-500/90";

  const filteredModels = showFreeOnly
    ? models.filter(model => model.pricing?.prompt === 0 && model.pricing?.completion === 0)
    : models;

  return (
    <Card className="glass-effect relative overflow-hidden transition-transform duration-500 hover:-translate-y-1">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradientAccent}`} />
      <div className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientAccent} text-lg font-semibold text-white shadow-[0_16px_40px_rgba(79,70,229,0.35)]`}>
              {participantNumber}
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Participant {participantNumber}</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Persona + model controls</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor={`sys${participantNumber}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              System prompt
            </Label>
            <Textarea
              id={`sys${participantNumber}`}
              value={systemPrompt}
              onChange={(event) => onSystemPromptChange(event.target.value)}
              placeholder={`Define the persona and stance for AI ${participantNumber}...`}
              className="mt-2 min-h-[140px] resize-vertical rounded-2xl border border-white/30 bg-white/60 font-mono text-sm shadow-inner transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div className="rounded-2xl border border-dashed border-white/30 bg-white/40 p-4 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
            <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Model selection
            </Label>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger className="mt-3 w-full rounded-2xl border-white/30 bg-white/80 text-left text-sm font-medium shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10">
                <SelectValue placeholder="Choose a model..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/20 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#111a34]/90">
                {filteredModels.length === 0 ? (
                  <SelectItem value="" disabled className="rounded-xl text-sm">
                    {models.length === 0 ? "No models available" : "No free models with current filter"}
                  </SelectItem>
                ) : (
                  filteredModels.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="rounded-xl text-sm">
                      {model.name ?? model.id}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/40 px-3 py-2 text-sm shadow-inner backdrop-blur dark:bg-white/5">
              <Checkbox
                id={`model${participantNumber}-free-filter`}
                checked={showFreeOnly}
                onCheckedChange={onShowFreeOnlyChange}
              />
              <Label htmlFor={`model${participantNumber}-free-filter`} className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Show free models only
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-white/20 bg-white/50 p-5 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Label>Temperature</Label>
                <span className="font-mono text-xs text-foreground">{temperature.toFixed(1)}</span>
              </div>
              <Slider value={[temperature]} onValueChange={onTemperatureChange} min={0.1} max={2.0} step={0.1} className="mt-1" />
            </div>

            <div className="space-y-3">
              <Label htmlFor={`maxTokens${participantNumber}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Max tokens (50–4000)
              </Label>
              <Input
                id={`maxTokens${participantNumber}`}
                type="number"
                value={maxTokens}
                onChange={(event) => onMaxTokensChange(parseInt(event.target.value, 10) || 512)}
                min={50}
                max={4000}
                className="rounded-2xl border-white/30 bg-white/70 font-mono text-sm shadow-inner focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Label>Top-P</Label>
                <span className="font-mono text-xs text-foreground">{topP.toFixed(2)}</span>
              </div>
              <Slider value={[topP]} onValueChange={onTopPChange} min={0.1} max={1.0} step={0.05} className="mt-1" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Label>Frequency penalty</Label>
                <span className="font-mono text-xs text-foreground">{frequencyPenalty.toFixed(1)}</span>
              </div>
              <Slider
                value={[frequencyPenalty]}
                onValueChange={onFrequencyPenaltyChange}
                min={-2}
                max={2}
                step={0.1}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
