import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Key, Trash2 } from "lucide-react";

interface APIKeyManagerProps {
  apiKeys: string[];
  currentKeyIndex: number;
  onAddKey: (key: string) => void;
  onRemoveKey: (key: string) => void;
  onClearAllKeys: () => void;
}

export const APIKeyManager = ({
  apiKeys,
  currentKeyIndex,
  onAddKey,
  onRemoveKey,
  onClearAllKeys,
}: APIKeyManagerProps) => {
  const [newKey, setNewKey] = useState("");

  const handleAddKey = () => {
    if (newKey.trim()) {
      onAddKey(newKey.trim());
      setNewKey("");
    }
  };

  const formatKeyDisplay = (key: string) => {
    return key.substring(0, 4) + "..." + key.substring(key.length - 4);
  };

  const currentKey = apiKeys[currentKeyIndex];

  return (
    <Card className="glass-effect">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">OpenRouter API Keys</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKeyInput" className="text-sm font-medium text-muted-foreground">
              Add New API Key:
            </Label>
            <div className="flex gap-3 mt-2">
              <Textarea
                id="apiKeyInput"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="font-mono text-sm min-h-[45px] flex-1"
                rows={1}
              />
              <Button onClick={handleAddKey} disabled={!newKey.trim()}>
                Add Key
              </Button>
            </div>
          </div>

          {currentKey && (
            <div className="p-3 bg-muted rounded-lg border">
              <div className="text-xs text-muted-foreground mb-1">Currently Using:</div>
              <div className="font-mono text-sm">
                {formatKeyDisplay(currentKey)} (Key {currentKeyIndex + 1} of {apiKeys.length})
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">
              Your stored keys ({apiKeys.length}):
            </Label>
            
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No API keys added yet.</p>
                <p className="text-sm">Add your OpenRouter API key to start debating!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {apiKeys.map((key, index) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg border hover:border-border-accent transition-colors"
                  >
                    <div className="flex-1 font-mono text-sm text-muted-foreground">
                      Key {index + 1}: {formatKeyDisplay(key)}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveKey(key)}
                      className="ml-3"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {apiKeys.length > 0 && (
              <Button
                variant="destructive"
                onClick={onClearAllKeys}
                className="w-full mt-4"
              >
                Clear All Keys
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};