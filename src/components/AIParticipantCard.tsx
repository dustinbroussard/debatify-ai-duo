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
  const borderColor = isAI1 ? "border-l-success" : "border-l-ai1";
  const iconBg = isAI1 ? "bg-success" : "bg-ai1";

  const filteredModels = showFreeOnly 
    ? models.filter(m => m.pricing?.prompt === 0 && m.pricing?.completion === 0)
    : models;

  return (
    <Card className={`glass-effect hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-l-4 ${borderColor}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
            {participantNumber}
          </div>
          <h3 className="text-lg font-semibold">AI Participant {participantNumber}</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor={`sys${participantNumber}`} className="text-sm font-medium text-muted-foreground">
              System Prompt:
            </Label>
            <Textarea
              id={`sys${participantNumber}`}
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder={`Define the persona and arguments for AI ${participantNumber}...`}
              className="mt-2 font-mono text-sm min-h-[120px] resize-vertical transition-all duration-300 focus:shadow-glow"
            />
          </div>

          <div className="pt-4 border-t border-dashed border-border">
            <Label className="text-sm font-medium text-muted-foreground">
              Select Model for AI {participantNumber}:
            </Label>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a model..." />
              </SelectTrigger>
              <SelectContent>
                {filteredModels.length === 0 ? (
                  <SelectItem value="" disabled>
                    {models.length === 0 ? "No models available" : "No models found with current filter"}
                  </SelectItem>
                ) : (
                  filteredModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.id}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id={`model${participantNumber}-free-filter`}
                checked={showFreeOnly}
                onCheckedChange={onShowFreeOnlyChange}
              />
              <Label
                htmlFor={`model${participantNumber}-free-filter`}
                className="text-sm text-muted-foreground"
              >
                Show only free models
              </Label>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Temperature: <span className="font-mono">{temperature.toFixed(1)}</span>
              </Label>
              <Slider
                value={[temperature]}
                onValueChange={onTemperatureChange}
                min={0.1}
                max={2.0}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`maxTokens${participantNumber}`} className="text-sm font-medium text-muted-foreground">
                Max Tokens (50–4000)
              </Label>
              <Input
                id={`maxTokens${participantNumber}`}
                type="number"
                value={maxTokens}
                onChange={(e) => onMaxTokensChange(parseInt(e.target.value) || 512)}
                min={50}
                max={4000}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Top‑P: <span className="font-mono">{topP.toFixed(2)}</span>
              </Label>
              <Slider
                value={[topP]}
                onValueChange={onTopPChange}
                min={0.1}
                max={1.0}
                step={0.05}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Frequency Penalty: <span className="font-mono">{frequencyPenalty.toFixed(1)}</span>
              </Label>
              <Slider
                value={[frequencyPenalty]}
                onValueChange={onFrequencyPenaltyChange}
                min={-2}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};