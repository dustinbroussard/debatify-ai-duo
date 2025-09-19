export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type StreamOptions = {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  max_tokens?: number;
  signal?: AbortSignal;
  onUsage?: (usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }) => void;
};

// Streams an OpenRouter chat completion as an async generator of content deltas
export async function* streamChatCompletion(opts: StreamOptions): AsyncGenerator<string, void, unknown> {
  const { apiKey, model, messages, temperature = 0.9, top_p = 1.0, frequency_penalty = 0, max_tokens = 512, signal } =
    opts;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      temperature,
      top_p,
      frequency_penalty,
      max_tokens,
      messages,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new HttpError(res.status, `OpenRouter request failed: ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") {
        return;
      }
      try {
        const json = JSON.parse(data);
        const delta: string | undefined = json?.choices?.[0]?.delta?.content;
        if (delta) {
          yield delta;
        }
        const usage = json?.usage;
        if (usage && typeof opts.onUsage === "function") {
          opts.onUsage(usage);
        }
      } catch {
        // ignore malformed events
      }
    }
  }
}

export function estimateTokens(text: string): number {
  // rough heuristic: ~4 chars/token
  return Math.ceil(text.length / 4);
}

export type ModelInfo = {
  id: string;
  name: string;
  pricing?: { prompt: number; completion: number };
  is_free?: boolean;
};

export async function fetchModels(apiKey: string): Promise<ModelInfo[]> {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) throw new HttpError(res.status, `Failed to fetch models: ${res.status} ${res.statusText}`);
  const json = await res.json();
  const list = (json?.data ?? []) as Array<{ id: string; name?: string; pricing?: { prompt?: number; completion?: number } }>;
  return list.map((m) => ({
    id: m?.id,
    name: m?.name ?? m?.id,
    pricing: m?.pricing ? { prompt: m.pricing?.prompt ?? 0, completion: m.pricing?.completion ?? 0 } : undefined,
    is_free: m?.id?.includes(":free") || (m?.pricing?.prompt === 0 && m?.pricing?.completion === 0),
  }));
}
