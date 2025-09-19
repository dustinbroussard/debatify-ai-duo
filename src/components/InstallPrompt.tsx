import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const SESSION_KEY = "debate-pwa-install-dismissed";
const LAST_PROMPT_KEY = "debate-pwa-install-last";
const PROMPT_INTERVAL_MS = 0; // Adjust this value (e.g. 86400000 for daily prompts).

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const isStandaloneMode = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
};

const meetsPromptFrequency = () => {
  if (PROMPT_INTERVAL_MS <= 0 || typeof window === "undefined") return true;
  const raw = localStorage.getItem(LAST_PROMPT_KEY);
  if (!raw) return true;
  const last = Number(raw);
  if (!Number.isFinite(last)) return true;
  return Date.now() - last >= PROMPT_INTERVAL_MS;
};

const recordPromptTimestamp = () => {
  if (PROMPT_INTERVAL_MS <= 0 || typeof window === "undefined") return;
  localStorage.setItem(LAST_PROMPT_KEY, Date.now().toString());
};

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSessionDismissed(sessionStorage.getItem(SESSION_KEY) === "true");
    setIsStandalone(isStandaloneMode());

    const handleAppInstalled = () => {
      sessionStorage.setItem(SESSION_KEY, "true");
      setSessionDismissed(true);
      setDeferredPrompt(null);
      setVisible(false);
      setIsStandalone(true);
    };

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayChange = () => setIsStandalone(isStandaloneMode());

    window.addEventListener("appinstalled", handleAppInstalled);
    mediaQuery.addEventListener?.("change", handleDisplayChange);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQuery.removeEventListener?.("change", handleDisplayChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setSessionDismissed(sessionStorage.getItem(SESSION_KEY) === "true");
      if (PROMPT_INTERVAL_MS > 0) {
        recordPromptTimestamp();
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
  }, []);

  useEffect(() => {
    if (!deferredPrompt) return;
    if (isStandalone || sessionDismissed) {
      setVisible(false);
      return;
    }

    if (meetsPromptFrequency()) {
      setVisible(true);
      recordPromptTimestamp();
    }
  }, [deferredPrompt, isStandalone, sessionDismissed]);

  const handleDismiss = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(SESSION_KEY, "true");
    setSessionDismissed(true);
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      sessionStorage.setItem(SESSION_KEY, "true");
      setSessionDismissed(true);
      setDeferredPrompt(null);
      setVisible(false);
      if (choiceResult?.outcome !== "accepted") {
        recordPromptTimestamp();
      }
    } catch (error) {
      console.warn("PWA install prompt failed", error);
      handleDismiss();
    }
  }, [deferredPrompt, handleDismiss]);

  const headline = useMemo(() => {
    if (isStandalone) return "App installed";
    return "Install Debatify for a native experience";
  }, [isStandalone]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:px-0">
      <div className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-5 shadow-[0_24px_65px_rgba(15,23,42,0.25)] backdrop-blur-2xl transition-all duration-500 dark:border-white/10 dark:bg-[#0f172a]/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-[0_14px_35px_rgba(79,70,229,0.35)]">
              <Download className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{headline}</h2>
              <p className="text-sm text-muted-foreground">
                Keep debates at your fingertips, even offline. Install the app to launch instantly with cached presets and models.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button onClick={handleInstall} size="sm" variant="hero" className="shadow-[0_16px_42px_rgba(79,70,229,0.35)]">
              <Download className="h-4 w-4" />
              Install now
            </Button>
            <Button onClick={handleDismiss} size="sm" variant="outline" className="backdrop-blur">
              Not this time
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/40 p-1.5 text-muted-foreground transition-all duration-200 hover:scale-105 hover:text-foreground dark:border-white/10 dark:bg-white/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
