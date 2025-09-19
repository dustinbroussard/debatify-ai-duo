import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileDown, Upload } from "lucide-react";

interface Message {
  speaker: 1 | 2 | "system";
  text: string;
  timestamp: Date;
}

interface ExportControlsProps {
  messages: Message[];
  onImportJson: (messages: Message[]) => void;
}

export const ExportControls = ({ messages, onImportJson }: ExportControlsProps) => {
  const exportAsMarkdown = () => {
    const markdown = messages
      .map((msg) => {
        const speaker = msg.speaker === 1 ? "AI 1" : msg.speaker === 2 ? "AI 2" : "System";
        const timestamp = msg.timestamp.toLocaleString();
        return `## ${speaker} (${timestamp})\n\n${msg.text}\n`;
      })
      .join("\n");

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debate-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJson = () => {
    const json = JSON.stringify(messages, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debate-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsHtml = () => {
    const content = messages
      .map((msg) => {
        const speaker = msg.speaker === 1 ? "AI 1" : msg.speaker === 2 ? "AI 2" : "System";
        const timestamp = msg.timestamp.toLocaleString();
        return `
          <div style="margin-bottom: 20px; padding: 18px; border-radius: 16px; border: 1px solid rgba(99,102,241,0.18); background: rgba(255,255,255,0.78);">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.12em; color: #1f2937;">${speaker} (${timestamp})</h3>
            <pre style="margin: 0; white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #111827;">${msg.text}</pre>
          </div>
        `;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>AI Debate Transcript</title>
          <style>
            body { font-family: 'Inter', sans-serif; max-width: 880px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%); }
            h1 { text-align: center; color: #1f2937; letter-spacing: 0.18em; text-transform: uppercase; }
            p { color: #475569; }
          </style>
        </head>
        <body>
          <h1>AI Debate Transcript</h1>
          <p style="text-align: center; color: #475569;">Generated on ${new Date().toLocaleString()}</p>
          ${content}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debate-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          try {
            const content = loadEvent.target?.result as string;
            const imported = JSON.parse(content);
            if (Array.isArray(imported)) {
              const revived = imported.map((m) => ({
                speaker: m.speaker,
                text: m.text,
                timestamp: new Date(m.timestamp),
              }));
              onImportJson(revived);
            }
          } catch (error) {
            console.error("Failed to import JSON:", error);
            alert("Failed to import JSON file. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Card className="glass-effect flex flex-col gap-4 p-6">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Export & Import</h3>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Take debates offline or bring transcripts back to life
          </p>
        </div>
        <span className="rounded-full border border-white/30 bg-white/40 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/10">
          {messages.length} messages
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={exportAsMarkdown}
          disabled={messages.length === 0}
          variant="outline"
          size="sm"
          className="rounded-2xl border-white/30 bg-white/40 shadow-inner backdrop-blur hover:bg-white/60 dark:border-white/10 dark:bg-white/10"
        >
          <FileText className="h-4 w-4" />
          Markdown
        </Button>

        <Button
          onClick={exportAsJson}
          disabled={messages.length === 0}
          variant="outline"
          size="sm"
          className="rounded-2xl border-white/30 bg-white/40 shadow-inner backdrop-blur hover:bg-white/60 dark:border-white/10 dark:bg-white/10"
        >
          <Download className="h-4 w-4" />
          JSON
        </Button>

        <Button
          onClick={exportAsHtml}
          disabled={messages.length === 0}
          variant="outline"
          size="sm"
          className="rounded-2xl border-white/30 bg-white/40 shadow-inner backdrop-blur hover:bg-white/60 dark:border-white/10 dark:bg-white/10"
        >
          <FileDown className="h-4 w-4" />
          HTML
        </Button>

        <Button
          onClick={importFromJson}
          variant="outline"
          size="sm"
          className="rounded-2xl border-white/30 bg-white/40 shadow-inner backdrop-blur hover:bg-white/60 dark:border-white/10 dark:bg-white/10"
          title="Load transcript JSON"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </div>
    </Card>
  );
};
