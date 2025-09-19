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
    <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
      <span className="text-sm">
        {participant ? `AI ${participant} thinking` : "AI thinking"}
      </span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-loading-pulse" />
        <div className="w-2 h-2 bg-primary rounded-full animate-loading-pulse [animation-delay:0.2s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-loading-pulse [animation-delay:0.4s]" />
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
          "p-4 rounded-xl border-l-4 animate-message-slide-in font-mono text-sm leading-relaxed",
          {
            "bg-success/10 border-l-success": isAI1,
            "bg-ai1/10 border-l-ai1": isAI2,
            "bg-ai2/10 border-l-ai2": isSystem,
          },
          className
        )}
      >
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold opacity-80">
          {isAI1 && "AI 1"}
          {isAI2 && "AI 2"}
          {isSystem && "System"}
          <span className="text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className="whitespace-pre-wrap">{message.text}</div>
      </div>
    );
  };

  if (splitView) {
    const ai1Messages = messages.filter((m) => m.speaker === 1);
    const ai2Messages = messages.filter((m) => m.speaker === 2);

    return (
      <div className="space-y-4">
        <Label className="text-lg font-semibold">🗣️ Live Debate (Split View):</Label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <span className="font-semibold">AI 1</span>
            </div>
            <Card className="h-[60vh] overflow-y-auto custom-scrollbar p-4 space-y-4">
              {ai1Messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isLoading && loadingParticipant === 1 && <LoadingIndicator participant={1} />}
              <div ref={leftChatEndRef} />
            </Card>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-ai1 rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <span className="font-semibold">AI 2</span>
            </div>
            <Card className="h-[60vh] overflow-y-auto custom-scrollbar p-4 space-y-4">
              {ai2Messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
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
      <Label className="text-lg font-semibold">🗣️ Live Debate:</Label>
      <Card className="h-[60vh] overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-center">
              The debate will appear here once you start it.
              <br />
              Configure your AI participants and click "Start Debate" to begin!
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        
        {isLoading && <LoadingIndicator />}
        <div ref={chatEndRef} />
      </Card>
    </div>
  );
};
