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

  const exportAsPdf = () => {
    // For now, we'll create a simple HTML version for printing
    const content = messages
      .map((msg) => {
        const speaker = msg.speaker === 1 ? "AI 1" : msg.speaker === 2 ? "AI 2" : "System";
        const timestamp = msg.timestamp.toLocaleString();
        return `
          <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid ${
            msg.speaker === 1 ? "#16a34a" : msg.speaker === 2 ? "#22d3ee" : "#6366f1"
          }; background: #f8f9fa;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${speaker} (${timestamp})</h3>
            <p style="margin: 0; white-space: pre-wrap; font-family: monospace;">${msg.text}</p>
          </div>
        `;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Debate Transcript</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { text-align: center; color: #333; }
          </style>
        </head>
        <body>
          <h1>AI Debate Transcript</h1>
          <p style="text-align: center; color: #666;">Generated on ${new Date().toLocaleString()}</p>
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
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const imported = JSON.parse(content);
            if (Array.isArray(imported)) {
              onImportJson(imported);
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
    <Card className="glass-effect">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-semibold text-muted-foreground">Export Debate</div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={exportAsMarkdown}
              disabled={messages.length === 0}
              variant="outline"
              size="sm"
            >
              <FileText className="w-4 h-4" />
              Markdown
            </Button>
            
            <Button
              onClick={exportAsJson}
              disabled={messages.length === 0}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4" />
              JSON
            </Button>
            
            <Button
              onClick={exportAsPdf}
              disabled={messages.length === 0}
              variant="outline"
              size="sm"
            >
              <FileDown className="w-4 h-4" />
              HTML
            </Button>
            
            <Button
              onClick={importFromJson}
              variant="outline"
              size="sm"
              title="Load transcript JSON"
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};