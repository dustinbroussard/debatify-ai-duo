import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Key, Trash2, RefreshCcw } from "lucide-react";

interface APIKeyManagerProps {
  apiKeys: string[];
  currentKeyIndex: number;
  onAddKey: (key: string) => void;
  onRemoveKey: (key: string) => void;
  onClearAllKeys: () => void;
  onNextKey?: () => void;
}

export const APIKeyManager = ({
  apiKeys,
  currentKeyIndex,
  onAddKey,
  onRemoveKey,
  onClearAllKeys,
  onNextKey,
}: APIKeyManagerProps) => {
  const [newKey, setNewKey] = useState("");

  const handleAddKey = () => {
    if (newKey.trim()) {
      onAddKey(newKey.trim());
      setNewKey("");
    }
  };

  const formatKeyDisplay = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}…${key.substring(key.length - 4)}`;
  };

  const currentKey = apiKeys[currentKeyIndex];

  return (
    <Card className="glass-effect space-y-6 p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-pink-500 text-white shadow-[0_16px_40px_rgba(79,70,229,0.35)]">
          <Key className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">OpenRouter API Keys</h2>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Securely stored in your browser</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="apiKeyInput" className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Add new API key
          </Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Textarea
              id="apiKeyInput"
              value={newKey}
              onChange={(event) => setNewKey(event.target.value)}
              placeholder="sk-or-v1-..."
              className="min-h-[52px] flex-1 rounded-2xl border-white/30 bg-white/60 font-mono text-sm shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5"
              rows={1}
            />
            <Button onClick={handleAddKey} disabled={!newKey.trim()} className="rounded-2xl">
              Add key
            </Button>
          </div>
        </div>

        {currentKey && (
          <div className="rounded-2xl border border-white/25 bg-white/50 p-4 shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Currently cycling</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-mono text-sm text-foreground">
                {formatKeyDisplay(currentKey)} (Key {currentKeyIndex + 1} of {apiKeys.length})
              </span>
              {onNextKey && (
                <Button size="sm" variant="outline" className="rounded-xl" onClick={onNextKey}>
                  <RefreshCcw className="h-4 w-4" />
                  Next key
                </Button>
              )}
            </div>
          </div>
        )}

        <div>
          <Label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Stored keys ({apiKeys.length})
          </Label>

          {apiKeys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/40 bg-white/40 px-6 py-10 text-center text-sm text-muted-foreground shadow-inner backdrop-blur dark:border-white/10 dark:bg-white/5">
              <Key className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p>No API keys added yet.</p>
              <p className="text-xs uppercase tracking-[0.22em]">Add your OpenRouter API key to start debating</p>
            </div>
          ) : (
            <div className="space-y-2">
              {apiKeys.map((key, index) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/55 px-4 py-3 text-sm shadow-inner backdrop-blur transition-colors hover:border-primary/40 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="font-mono text-sm text-muted-foreground">
                    Key {index + 1}: {formatKeyDisplay(key)}
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveKey(key)}
                    className="rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {apiKeys.length > 0 && (
            <Button variant="destructive" onClick={onClearAllKeys} className="mt-4 w-full rounded-2xl">
              Clear all keys
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
