import { Sparkles, ShieldCheck, Waves } from "lucide-react";

import heroImage from "@/assets/hero-debate.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Header = () => {
  const handleScrollToControls = () => {
    document.getElementById("debate-controls")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card className="glass-effect relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Abstract debate" className="h-full w-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-hero opacity-75 mix-blend-multiply" />
      </div>

      <div className="absolute -left-20 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl md:block" />
      <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:text-left">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
            <Sparkles className="h-3.5 w-3.5" />
            Dual AI Debate Studio
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              <span className="block font-light uppercase tracking-[0.25em] text-white/70">Debatify Duo</span>
              <span className="gradient-text block text-transparent">Where brilliant minds collide</span>
            </h1>
            <p className="max-w-2xl text-base text-white/80 sm:text-lg">
              Configure two AI personas, monitor latency and cost in real time, and export transcripts instantly. Install the app
              to keep the studio by your side—even when you are offline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/80">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Offline-ready PWA
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
              <Waves className="h-3.5 w-3.5" /> Live streaming
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> Export transcripts
            </span>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-4 rounded-3xl border border-white/30 bg-white/20 p-6 text-sm text-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white">Quick start</h3>
          <p className="text-sm text-white/80">
            Add an OpenRouter key, pick a preset, and press <strong>Start Debate</strong>. Debatify takes care of streaming,
            logging, and exports.
          </p>
          <Button variant="hero" size="lg" className="w-full" onClick={handleScrollToControls}>
            Launch debate room
          </Button>
        </div>
      </div>
    </Card>
  );
};
