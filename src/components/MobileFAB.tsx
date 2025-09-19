import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface MobileFABProps {
  isRunning: boolean;
  canStart: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const MobileFAB = ({ isRunning, canStart, onStart, onStop }: MobileFABProps) => {
  if (!canStart && !isRunning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Button
        size="fab"
        variant={isRunning ? "stop" : "hero"}
        onClick={isRunning ? onStop : onStart}
        disabled={!canStart && !isRunning}
        className="shadow-elevated animate-glow"
      >
        {isRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </Button>
    </div>
  );
};