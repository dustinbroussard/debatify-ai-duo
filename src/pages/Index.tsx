import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FloatingParticles } from "@/components/FloatingParticles";
import { AIParticipantCard } from "@/components/AIParticipantCard";
import { DebateControls } from "@/components/DebateControls";
import { DebatePresets } from "@/components/DebatePresets";
import { DEBATE_PRESETS } from "@/constants/debate-presets";
import { streamChatCompletion, estimateTokens, type ChatMessage, fetchModels, HttpError } from "@/lib/openrouter";
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
  const reviveMessages = (
    msgs: Array<{ speaker: 1 | 2 | "system"; text: string; timestamp: string | number | Date }>,
  ): Message[] =>
    (msgs || []).map((m) => ({
      speaker: m.speaker,
      text: m.text,
      timestamp: m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp),
    }));

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
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const runningRef = useRef(false);

  useEffect(() => {
    const savedState = localStorage.getItem("synthetica-debate-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.ai1Config) setAI1Config(parsed.ai1Config);
        if (parsed.ai2Config) setAI2Config(parsed.ai2Config);
        if (parsed.debateState) {
          const revivedMessages = reviveMessages(parsed.debateState.messages);
          setDebateState((prev) => ({
            ...prev,
            ...parsed.debateState,
            messages: revivedMessages,
            isRunning: false,
            isLoading: false,
            loadingParticipant: null,
          }));
        }
        if (parsed.apiKeys) setApiKeys(parsed.apiKeys);
        if (parsed.selectedPreset) setSelectedPreset(parsed.selectedPreset);
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const cacheKey = "synthetica-models-cache";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.ts && Date.now() - parsed.ts < 6 * 60 * 60 * 1000 && Array.isArray(parsed.models)) {
            setModels(parsed.models);
          }
        } catch (error) {
          console.debug("Ignoring invalid models cache", error);
        }
      }
      const key = apiKeys[currentKeyIndex];
      if (!key) return;
      try {
        const list = await fetchModels(key);
        setModels(list);
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), models: list }));
      } catch (error) {
        console.warn("Failed to fetch models, falling back to defaults", error);
        if (!cached) {
          setModels([
            { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", pricing: { prompt: 0.003, completion: 0.015 } },
            { id: "openai/gpt-4o", name: "GPT-4o", pricing: { prompt: 0.005, completion: 0.015 } },
            { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B (Free)", pricing: { prompt: 0, completion: 0 } },
          ]);
        }
      }
    };
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeys.length, currentKeyIndex]);

  useEffect(() => {
    messagesRef.current = debateState.messages;
    const stateToSave = {
      ai1Config,
      ai2Config,
      debateState: { ...debateState, isRunning: false, isLoading: false, loadingParticipant: null },
      apiKeys,
      selectedPreset,
    };
    localStorage.setItem("synthetica-debate-state", JSON.stringify(stateToSave));
  }, [ai1Config, ai2Config, debateState, apiKeys, selectedPreset]);

  useEffect(() => {
    runningRef.current = debateState.isRunning;
  }, [debateState.isRunning]);

  const handleAddApiKey = (key: string) => {
    if (!apiKeys.includes(key)) {
      setApiKeys((prev) => [...prev, key]);
    }
  };

  const handleRemoveApiKey = (key: string) => {
    setApiKeys((prev) => {
      const newKeys = prev.filter((k) => k !== key);
      setCurrentKeyIndex((idx) => Math.min(idx, Math.max(0, newKeys.length - 1)));
      return newKeys;
    });
  };

  const handleClearAllKeys = () => {
    setApiKeys([]);
    setCurrentKeyIndex(0);
  };

  const handleApplyPreset = () => {
    const preset = DEBATE_PRESETS[selectedPreset as keyof typeof DEBATE_PRESETS];
    if (preset && selectedPreset !== "custom") {
      setAI1Config((prev) => ({ ...prev, systemPrompt: preset.ai1 }));
      setAI2Config((prev) => ({ ...prev, systemPrompt: preset.ai2 }));
    }
  };

  const handleSwapSides = () => {
    setAI1Config((prev1) => {
      const next1 = ai2Config;
      setAI2Config(prev1);
      return next1;
    });
  };

  const findModelPricing = (modelId: string) => models.find((model) => model.id === modelId)?.pricing;

  const estimateCostUSD = (modelId: string, promptTokens: number, completionTokens: number) => {
    const pricing = findModelPricing(modelId);
    if (!pricing) return 0;
    return (promptTokens * pricing.prompt + completionTokens * pricing.completion) / 1000;
  };

  const buildContextFor = (speaker: 1 | 2, messages: Message[], sysPrompt: string): ChatMessage[] => {
    const lines = messages
      .filter((m) => m.speaker !== "system")
      .map((m) => `${m.speaker === 1 ? "AI 1" : "AI 2"}: ${m.text}`)
      .join("\n\n");
    const instruction = `You are ${speaker === 1 ? "AI 1" : "AI 2"}. Reply concisely in 1-3 paragraphs. Do not roleplay the other speaker.`;
    return [
      { role: "system", content: `${sysPrompt}\n\n${instruction}` },
      { role: "user", content: lines || "Begin the debate." },
    ];
  };

  const handleStartDebate = async () => {
    if (!canStart) return;
    const controller = new AbortController();
    abortRef.current = controller;
    runningRef.current = true;

    setDebateState((prev) => ({
      ...prev,
      isRunning: true,
      currentTurn: 0,
      messages: [{ speaker: "system" as const, text: "Let us begin the debate!", timestamp: new Date() }],
      loadingParticipant: null,
    }));

    const runTurn = async (speaker: 1 | 2) => {
      const cfg = speaker === 1 ? ai1Config : ai2Config;
      const ctx = buildContextFor(speaker, messagesRef.current, cfg.systemPrompt);
      let keyIndex = currentKeyIndex;
      let apiKey = apiKeys[keyIndex];
      const started = performance.now();
      let accumulated = "";
      const promptTokens = estimateTokens(ctx.map((m) => m.content).join("\n\n"));
      let completionTokens = 0;
      let usagePrompt = 0;
      let usageCompletion = 0;

      setDebateState((prev) => ({ ...prev, isLoading: true, loadingParticipant: speaker }));
      setDebateState((prev) => ({
        ...prev,
        messages: [...prev.messages, { speaker, text: "", timestamp: new Date() }],
      }));

      try {
        const maxAttempts = Math.max(1, Math.min(6, apiKeys.length * 2));
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            for await (const chunk of streamChatCompletion({
              apiKey,
              model: cfg.model,
              messages: ctx,
              temperature: cfg.temperature,
              top_p: cfg.topP,
              frequency_penalty: cfg.frequencyPenalty,
              max_tokens: cfg.maxTokens,
              signal: controller.signal,
              onUsage: (usage) => {
                usagePrompt = usage.prompt_tokens ?? 0;
                usageCompletion = usage.completion_tokens ?? 0;
              },
            })) {
              accumulated += chunk;
              completionTokens = estimateTokens(accumulated);
              setDebateState((prev) => ({
                ...prev,
                messages: prev.messages.map((message, index, arr) =>
                  index === arr.length - 1 ? { ...message, text: accumulated } : message,
                ),
              }));
            }
            break;
          } catch (error) {
            const status = error instanceof HttpError ? error.status : 0;
            const retryable = status === 401 || status === 403 || status === 429 || status >= 500;
            if (!retryable || apiKeys.length <= 1 || attempt === maxAttempts - 1) {
              throw error;
            }
            keyIndex = (keyIndex + 1) % apiKeys.length;
            apiKey = apiKeys[keyIndex];
            setCurrentKeyIndex(keyIndex);
            const backoff = Math.min(2000, 300 * 2 ** attempt);
            await new Promise((resolve) => setTimeout(resolve, backoff));
          }
        }

        const latency = Math.round(performance.now() - started);
        setStats((prev) => {
          const prompt = usagePrompt || promptTokens;
          const completion = usageCompletion || completionTokens;
          const cost = estimateCostUSD(cfg.model, prompt, completion);
          const aiKey = speaker === 1 ? "ai1" : "ai2";
          const newCost = { ...prev.cost, [aiKey]: prev.cost[aiKey] + cost } as typeof prev.cost;
          newCost.total = newCost.ai1 + newCost.ai2;
          const newTokens = {
            ai1: speaker === 1 ? prev.tokens.ai1 + completion : prev.tokens.ai1,
            ai2: speaker === 2 ? prev.tokens.ai2 + completion : prev.tokens.ai2,
          };
          return { lastLatency: latency, tokens: newTokens, cost: newCost };
        });
      } catch (error) {
        console.error("Generation failed", error);
        setDebateState((prev) => ({
          ...prev,
          messages: prev.messages.map((message, index, arr) =>
            index === arr.length - 1 ? { ...message, text: message.text + "\n\n[Generation stopped or failed]" } : message,
          ),
        }));
      } finally {
        setDebateState((prev) => ({ ...prev, isLoading: false, loadingParticipant: null }));
      }
    };

    for (let turn = 0; turn < debateState.maxTurns; turn++) {
      if (!runningRef.current || controller.signal.aborted) break;
      const speaker: 1 | 2 = turn % 2 === 0 ? 1 : 2;
      await runTurn(speaker);
      if (!runningRef.current || controller.signal.aborted) break;
    }

    runningRef.current = false;
    abortRef.current = null;
    setDebateState((prev) => ({ ...prev, isRunning: false, isLoading: false, loadingParticipant: null }));
  };

  const handleStopDebate = () => {
    runningRef.current = false;
    setDebateState((prev) => ({
      ...prev,
      isRunning: false,
      isLoading: false,
      loadingParticipant: null,
    }));
    try {
      abortRef.current?.abort();
    } catch (error) {
      console.warn("Failed to abort debate stream", error);
    } finally {
      abortRef.current = null;
    }
  };

  const handleImportJson = (importedMessages: Message[]) => {
    setDebateState((prev) => ({
      ...prev,
      messages: importedMessages,
      isRunning: false,
      loadingParticipant: null,
    }));
  };

  const canStart = apiKeys.length > 0 && !!ai1Config.model && !!ai2Config.model;

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <FloatingParticles />

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-transparent to-primary/10 dark:from-[#050814] dark:via-transparent dark:to-[#1a1f3f]/50" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 pb-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/40 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/10">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse" />
              PWA Ready
            </span>
            <span className="text-sm text-muted-foreground">
              Installable offline-first debate studio
            </span>
          </div>
          <ThemeToggle />
        </div>

        <Header />

        <DebatePresets
          selectedPreset={selectedPreset}
          onPresetChange={setSelectedPreset}
          onApplyPreset={handleApplyPreset}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <AIParticipantCard
            participantNumber={1}
            systemPrompt={ai1Config.systemPrompt}
            onSystemPromptChange={(value) => setAI1Config((prev) => ({ ...prev, systemPrompt: value }))}
            selectedModel={ai1Config.model}
            onModelChange={(value) => setAI1Config((prev) => ({ ...prev, model: value }))}
            showFreeOnly={ai1Config.showFreeOnly}
            onShowFreeOnlyChange={(checked) => setAI1Config((prev) => ({ ...prev, showFreeOnly: !!checked }))}
            temperature={ai1Config.temperature}
            onTemperatureChange={(value) => setAI1Config((prev) => ({ ...prev, temperature: value[0] }))}
            maxTokens={ai1Config.maxTokens}
            onMaxTokensChange={(value) => setAI1Config((prev) => ({ ...prev, maxTokens: value }))}
            topP={ai1Config.topP}
            onTopPChange={(value) => setAI1Config((prev) => ({ ...prev, topP: value[0] }))}
            frequencyPenalty={ai1Config.frequencyPenalty}
            onFrequencyPenaltyChange={(value) => setAI1Config((prev) => ({ ...prev, frequencyPenalty: value[0] }))}
            models={models}
          />

          <AIParticipantCard
            participantNumber={2}
            systemPrompt={ai2Config.systemPrompt}
            onSystemPromptChange={(value) => setAI2Config((prev) => ({ ...prev, systemPrompt: value }))}
            selectedModel={ai2Config.model}
            onModelChange={(value) => setAI2Config((prev) => ({ ...prev, model: value }))}
            showFreeOnly={ai2Config.showFreeOnly}
            onShowFreeOnlyChange={(checked) => setAI2Config((prev) => ({ ...prev, showFreeOnly: !!checked }))}
            temperature={ai2Config.temperature}
            onTemperatureChange={(value) => setAI2Config((prev) => ({ ...prev, temperature: value[0] }))}
            maxTokens={ai2Config.maxTokens}
            onMaxTokensChange={(value) => setAI2Config((prev) => ({ ...prev, maxTokens: value }))}
            topP={ai2Config.topP}
            onTopPChange={(value) => setAI2Config((prev) => ({ ...prev, topP: value[0] }))}
            frequencyPenalty={ai2Config.frequencyPenalty}
            onFrequencyPenaltyChange={(value) => setAI2Config((prev) => ({ ...prev, frequencyPenalty: value[0] }))}
            models={models}
          />
        </div>

        <DebateControls
          maxTurns={debateState.maxTurns}
          onMaxTurnsChange={(value) => setDebateState((prev) => ({ ...prev, maxTurns: value }))}
          splitView={debateState.splitView}
          onSplitViewChange={(checked) => setDebateState((prev) => ({ ...prev, splitView: !!checked }))}
          isRunning={debateState.isRunning}
          onStart={handleStartDebate}
          onStop={handleStopDebate}
          onSwap={handleSwapSides}
          canStart={canStart}
        />

        <ChatInterface
          messages={debateState.messages}
          splitView={debateState.splitView}
          isLoading={debateState.isLoading}
          loadingParticipant={debateState.loadingParticipant ?? undefined}
        />

        <DebateStats lastLatency={stats.lastLatency} tokens={stats.tokens} cost={stats.cost} />

        <ExportControls messages={debateState.messages} onImportJson={handleImportJson} />

        <APIKeyManager
          apiKeys={apiKeys}
          currentKeyIndex={currentKeyIndex}
          onAddKey={handleAddApiKey}
          onRemoveKey={handleRemoveApiKey}
          onClearAllKeys={handleClearAllKeys}
          onNextKey={() => setCurrentKeyIndex((index) => (apiKeys.length ? (index + 1) % apiKeys.length : 0))}
        />
      </div>

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
