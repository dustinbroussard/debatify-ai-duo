import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Message {
  speaker: 1 | 2 | "system";
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  splitView: boolean;
  isLoading: boolean;
  loadingParticipant?: 1 | 2 | null;
}

export const ChatInterface = ({ messages, splitView, isLoading, loadingParticipant }: ChatInterfaceProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const leftChatEndRef = useRef<HTMLDivElement>(null);
  const rightChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    leftChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    rightChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const LoadingIndicator = ({ participant }: { participant?: 1 | 2 }) => (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/30 bg-white/40 px-4 py-3 text-xs uppercase tracking-[0.24em] text-muted-foreground shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
      <span>{participant ? `AI ${participant} thinking` : "AI thinking"}</span>
      <div className="flex gap-1">
        <div className="h-2 w-2 rounded-full bg-primary animate-loading-pulse" />
        <div className="h-2 w-2 rounded-full bg-primary/70 animate-loading-pulse [animation-delay:0.2s]" />
        <div className="h-2 w-2 rounded-full bg-primary/50 animate-loading-pulse [animation-delay:0.4s]" />
      </div>
    </div>
  );

  const MessageBubble = ({ message, className }: { message: Message; className?: string }) => {
    const isAI1 = message.speaker === 1;
    const isAI2 = message.speaker === 2;
    const isSystem = message.speaker === "system";

    return (
      <div
        className={cn(
          "animate-message-slide-in rounded-3xl border px-5 py-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5",
          {
            "border-ai1/40 bg-gradient-to-br from-cyan-50/90 to-sky-50/60 text-foreground dark:border-ai1/40 dark:from-cyan-500/15 dark:to-sky-500/10 dark:text-white/90":
              isAI1,
            "border-ai2/40 bg-gradient-to-br from-pink-50/90 to-violet-50/70 text-foreground dark:border-ai2/40 dark:from-pink-500/15 dark:to-violet-500/10 dark:text-white/90":
              isAI2,
            "border-white/30 bg-white/80 text-foreground shadow-inner dark:border-white/10 dark:bg-white/10 dark:text-white/80":
              isSystem,
          },
          className,
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          <span className="flex items-center gap-2">
            {isAI1 && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-ai1 text-xs font-bold text-white shadow-glow">
                1
              </span>
            )}
            {isAI2 && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-ai2 text-xs font-bold text-white shadow-glow-secondary">
                2
              </span>
            )}
            {isSystem && <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-xs font-bold text-white">∞</span>}
            <span>{isAI1 ? "AI 1" : isAI2 ? "AI 2" : "System"}</span>
          </span>
          <span className="font-mono text-[0.6rem] text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 dark:text-white/90">{message.text}</div>
      </div>
    );
  };

  if (splitView) {
    const ai1Messages = messages.filter((m) => m.speaker === 1);
    const ai2Messages = messages.filter((m) => m.speaker === 2);

    return (
      <div className="space-y-4">
        <Label className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live debate · Split view</Label>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-ai1 text-xs font-bold text-white shadow-glow">
                1
              </span>
              <span>AI 1 timeline</span>
            </div>
            <Card className="glass-effect h-[60vh] overflow-y-auto custom-scrollbar space-y-4 p-5">
              {ai1Messages.map((message, index) => (
                <MessageBubble key={`${message.speaker}-${index}`} message={message} />
              ))}
              {isLoading && loadingParticipant === 1 && <LoadingIndicator participant={1} />}
              <div ref={leftChatEndRef} />
            </Card>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-ai2 text-xs font-bold text-white shadow-glow-secondary">
                2
              </span>
              <span>AI 2 timeline</span>
            </div>
            <Card className="glass-effect h-[60vh] overflow-y-auto custom-scrollbar space-y-4 p-5">
              {ai2Messages.map((message, index) => (
                <MessageBubble key={`${message.speaker}-${index}`} message={message} />
              ))}
              {isLoading && loadingParticipant === 2 && <LoadingIndicator participant={2} />}
              <div ref={rightChatEndRef} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live debate feed</Label>
      <Card className="glass-effect h-[60vh] overflow-y-auto custom-scrollbar space-y-4 p-5">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            <p className="max-w-md text-center">
              Configure your participants and press <span className="font-semibold">Start debate</span> to watch the transcript evolve in real time.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble key={`${message.speaker}-${index}`} message={message} />
        ))}

        {isLoading && <LoadingIndicator />}
        <div ref={chatEndRef} />
      </Card>
    </div>
  );
};
