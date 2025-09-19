import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FloatingParticles } from "@/components/FloatingParticles";
import { AIParticipantCard } from "@/components/AIParticipantCard";
import { DebateControls } from "@/components/DebateControls";
import { DebatePresets, DEBATE_PRESETS } from "@/components/DebatePresets";
import { ChatInterface } from "@/components/ChatInterface";
import { APIKeyManager } from "@/components/APIKeyManager";
import { DebateStats } from "@/components/DebateStats";
import { ExportControls } from "@/components/ExportControls";
import { MobileFAB } from "@/components/MobileFAB";
import { Header } from "@/components/Header";

interface Message {
  speaker: 1 | 2 | "system";
  text: string;
  timestamp: Date;
}

interface AIConfig {
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  showFreeOnly: boolean;
}

const Index = () => {
  // State management
  const [ai1Config, setAI1Config] = useState<AIConfig>({
    systemPrompt: DEBATE_PRESETS.marx_smith.ai1,
    model: "",
    temperature: 0.9,
    maxTokens: 512,
    topP: 1.0,
    frequencyPenalty: 0,
    showFreeOnly: false,
  });

  const [ai2Config, setAI2Config] = useState<AIConfig>({
    systemPrompt: DEBATE_PRESETS.marx_smith.ai2,
    model: "",
    temperature: 0.9,
    maxTokens: 512,
    topP: 1.0,
    frequencyPenalty: 0,
    showFreeOnly: false,
  });

  const [debateState, setDebateState] = useState({
    maxTurns: 20,
    splitView: false,
    isRunning: false,
    currentTurn: 0,
    messages: [] as Message[],
    isLoading: false,
    loadingParticipant: null as 1 | 2 | null,
  });

  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState("marx_smith");
  const [models, setModels] = useState<Array<{ id: string; name: string; pricing?: { prompt: number; completion: number } }>>([]);
  const [stats, setStats] = useState({
    lastLatency: null as number | null,
    tokens: { ai1: 0, ai2: 0 },
    cost: { ai1: 0, ai2: 0, total: 0 },
  });

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("synthetica-debate-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.ai1Config) setAI1Config(parsed.ai1Config);
        if (parsed.ai2Config) setAI2Config(parsed.ai2Config);
        if (parsed.debateState) {
          setDebateState(prev => ({ ...prev, ...parsed.debateState, isRunning: false, isLoading: false }));
        }
        if (parsed.apiKeys) setApiKeys(parsed.apiKeys);
        if (parsed.selectedPreset) setSelectedPreset(parsed.selectedPreset);
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }

    // Mock models for demo (in real app, these would be fetched from OpenRouter API)
    setModels([
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", pricing: { prompt: 0.003, completion: 0.015 } },
      { id: "openai/gpt-4o", name: "GPT-4o", pricing: { prompt: 0.005, completion: 0.015 } },
      { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", pricing: { prompt: 0.0005, completion: 0.0015 } },
      { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B (Free)", pricing: { prompt: 0, completion: 0 } },
      { id: "microsoft/phi-3-medium-4k-instruct:free", name: "Phi-3 Medium (Free)", pricing: { prompt: 0, completion: 0 } },
    ]);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      ai1Config,
      ai2Config,
      debateState: { ...debateState, isRunning: false, isLoading: false },
      apiKeys,
      selectedPreset,
    };
    localStorage.setItem("synthetica-debate-state", JSON.stringify(stateToSave));
  }, [ai1Config, ai2Config, debateState, apiKeys, selectedPreset]);

  // Event handlers
  const handleAddApiKey = (key: string) => {
    if (!apiKeys.includes(key)) {
      setApiKeys(prev => [...prev, key]);
    }
  };

  const handleRemoveApiKey = (key: string) => {
    setApiKeys(prev => prev.filter(k => k !== key));
    if (currentKeyIndex >= apiKeys.length - 1) {
      setCurrentKeyIndex(Math.max(0, apiKeys.length - 2));
    }
  };

  const handleClearAllKeys = () => {
    setApiKeys([]);
    setCurrentKeyIndex(0);
  };

  const handleApplyPreset = () => {
    const preset = DEBATE_PRESETS[selectedPreset as keyof typeof DEBATE_PRESETS];
    if (preset && selectedPreset !== "custom") {
      setAI1Config(prev => ({ ...prev, systemPrompt: preset.ai1 }));
      setAI2Config(prev => ({ ...prev, systemPrompt: preset.ai2 }));
    }
  };

  const handleSwapSides = () => {
    const temp = ai1Config;
    setAI1Config(ai2Config);
    setAI2Config(temp);
  };

  const handleStartDebate = () => {
    setDebateState(prev => ({
      ...prev,
      isRunning: true,
      currentTurn: 0,
      messages: [{
        speaker: "system" as const,
        text: "Let us begin the debate!",
        timestamp: new Date(),
      }],
    }));

    // In a real implementation, this would start the actual AI conversation
    // For demo purposes, we'll add some sample messages
    setTimeout(() => {
      setDebateState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          speaker: 1,
          text: "Greetings! I argue that the current economic system perpetuates inequality and exploitation of the working class. The labor theory of value clearly demonstrates that workers create all value, yet they receive only a fraction of what they produce.",
          timestamp: new Date(),
        }],
      }));
    }, 1000);

    setTimeout(() => {
      setDebateState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          speaker: 2,
          text: "I respectfully disagree. The invisible hand of the market coordinates individual self-interest to create collective prosperity. Voluntary exchange ensures that both parties benefit, and competition drives innovation and efficiency that benefits all of society.",
          timestamp: new Date(),
        }],
      }));
    }, 3000);
  };

  const handleStopDebate = () => {
    setDebateState(prev => ({
      ...prev,
      isRunning: false,
      isLoading: false,
    }));
  };

  const handleImportJson = (importedMessages: Message[]) => {
    setDebateState(prev => ({
      ...prev,
      messages: importedMessages,
      isRunning: false,
    }));
  };

  const canStart = apiKeys.length > 0 && !!ai1Config.model && !!ai2Config.model;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <FloatingParticles />
      
      <div className="max-w-6xl mx-auto">
        <Card className="glass-effect animate-slide-in-up">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm font-medium text-muted-foreground opacity-90">
                PWA Ready
              </div>
              <ThemeToggle />
            </div>

            {/* Hero Header */}
            <Header />

            {/* Debate Presets */}
            <DebatePresets
              selectedPreset={selectedPreset}
              onPresetChange={setSelectedPreset}
              onApplyPreset={handleApplyPreset}
            />

            {/* AI Participant Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AIParticipantCard
                participantNumber={1}
                systemPrompt={ai1Config.systemPrompt}
                onSystemPromptChange={(value) => setAI1Config(prev => ({ ...prev, systemPrompt: value }))}
                selectedModel={ai1Config.model}
                onModelChange={(value) => setAI1Config(prev => ({ ...prev, model: value }))}
                showFreeOnly={ai1Config.showFreeOnly}
                onShowFreeOnlyChange={(checked) => setAI1Config(prev => ({ ...prev, showFreeOnly: !!checked }))}
                temperature={ai1Config.temperature}
                onTemperatureChange={(value) => setAI1Config(prev => ({ ...prev, temperature: value[0] }))}
                maxTokens={ai1Config.maxTokens}
                onMaxTokensChange={(value) => setAI1Config(prev => ({ ...prev, maxTokens: value }))}
                topP={ai1Config.topP}
                onTopPChange={(value) => setAI1Config(prev => ({ ...prev, topP: value[0] }))}
                frequencyPenalty={ai1Config.frequencyPenalty}
                onFrequencyPenaltyChange={(value) => setAI1Config(prev => ({ ...prev, frequencyPenalty: value[0] }))}
                models={models}
              />

              <AIParticipantCard
                participantNumber={2}
                systemPrompt={ai2Config.systemPrompt}
                onSystemPromptChange={(value) => setAI2Config(prev => ({ ...prev, systemPrompt: value }))}
                selectedModel={ai2Config.model}
                onModelChange={(value) => setAI2Config(prev => ({ ...prev, model: value }))}
                showFreeOnly={ai2Config.showFreeOnly}
                onShowFreeOnlyChange={(checked) => setAI2Config(prev => ({ ...prev, showFreeOnly: !!checked }))}
                temperature={ai2Config.temperature}
                onTemperatureChange={(value) => setAI2Config(prev => ({ ...prev, temperature: value[0] }))}
                maxTokens={ai2Config.maxTokens}
                onMaxTokensChange={(value) => setAI2Config(prev => ({ ...prev, maxTokens: value }))}
                topP={ai2Config.topP}
                onTopPChange={(value) => setAI2Config(prev => ({ ...prev, topP: value[0] }))}
                frequencyPenalty={ai2Config.frequencyPenalty}
                onFrequencyPenaltyChange={(value) => setAI2Config(prev => ({ ...prev, frequencyPenalty: value[0] }))}
                models={models}
              />
            </div>

            {/* Debate Controls */}
            <DebateControls
              maxTurns={debateState.maxTurns}
              onMaxTurnsChange={(value) => setDebateState(prev => ({ ...prev, maxTurns: value }))}
              splitView={debateState.splitView}
              onSplitViewChange={(checked) => setDebateState(prev => ({ ...prev, splitView: !!checked }))}
              isRunning={debateState.isRunning}
              onStart={handleStartDebate}
              onStop={handleStopDebate}
              onSwap={handleSwapSides}
              canStart={canStart}
            />

            {/* Chat Interface */}
            <ChatInterface
              messages={debateState.messages}
              splitView={debateState.splitView}
              isLoading={debateState.isLoading}
              loadingParticipant={debateState.loadingParticipant}
            />

            {/* Stats */}
            <DebateStats
              lastLatency={stats.lastLatency}
              tokens={stats.tokens}
              cost={stats.cost}
            />

            {/* Export Controls */}
            <ExportControls
              messages={debateState.messages}
              onImportJson={handleImportJson}
            />

            {/* API Key Manager */}
            <APIKeyManager
              apiKeys={apiKeys}
              currentKeyIndex={currentKeyIndex}
              onAddKey={handleAddApiKey}
              onRemoveKey={handleRemoveApiKey}
              onClearAllKeys={handleClearAllKeys}
            />
          </div>
        </Card>
      </div>

      {/* Mobile FAB */}
      <MobileFAB
        isRunning={debateState.isRunning}
        canStart={canStart}
        onStart={handleStartDebate}
        onStop={handleStopDebate}
      />
    </div>
  );
};

export default Index;
