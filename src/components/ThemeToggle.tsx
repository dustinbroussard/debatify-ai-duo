import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    const isDarkTheme = savedTheme === "dark";
    setIsDark(isDarkTheme);
    document.documentElement.classList.toggle("dark", isDarkTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Light</span>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="relative w-12 h-6 p-0 rounded-full"
      >
        <div
          className={`absolute w-5 h-5 bg-foreground rounded-full transition-transform duration-300 ${
            isDark ? "translate-x-2" : "-translate-x-2"
          }`}
        />
      </Button>
      <span className="text-sm text-muted-foreground">Dark</span>
    </div>
  );
};