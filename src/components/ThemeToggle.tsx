import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";

import { cn } from "@/lib/utils";

const LIGHT_THEME_COLOR = "#1f2a6b";
const DARK_THEME_COLOR = "#0c1024";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  }, [isDark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      setIsDark(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label="Toggle color theme"
      className="group relative inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/40 px-4 py-2 shadow-inner backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(79,70,229,0.25)] dark:border-white/10 dark:bg-white/10"
    >
      <SunMedium
        className={cn(
          "h-4 w-4 text-amber-500 transition-all duration-300",
          isDark ? "opacity-40 -rotate-12" : "opacity-100 rotate-0",
        )}
      />
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Theme</span>
      <div className="relative h-6 w-12 rounded-full bg-white/70 transition-colors duration-300 dark:bg-white/10">
        <div
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-[0_8px_20px_rgba(79,70,229,0.45)] transition-transform duration-300",
            isDark ? "translate-x-7" : "translate-x-1",
          )}
        />
      </div>
      <Moon
        className={cn(
          "h-4 w-4 text-indigo-200 transition-opacity duration-300",
          isDark ? "opacity-100" : "opacity-40",
        )}
      />
    </button>
  );
};
