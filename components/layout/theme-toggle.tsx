"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  // useTheme vem do seu theme-provider (ThemeContextValue)
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // evita bug de hydration (tema diferente no server/client)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className={cn(
        "relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border text-xs transition-all",
        // base light
        "border-slate-200 bg-white text-slate-800",
        // base dark
        "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
        // efeito de interação
        "hover:scale-105 active:scale-95"
      )}
    >
      {/* Ícone do SOL (modo claro) */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isDark
            ? "opacity-0 scale-0 rotate-90"
            : "opacity-100 scale-100 rotate-0"
        )}
      >
        <Sun className="h-4 w-4 text-yellow-400" />
      </span>

      {/* Ícone da LUA (modo escuro) */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isDark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-0 -rotate-90"
        )}
      >
        <Moon className="h-4 w-4 text-purple-300" />
      </span>
    </button>
  );
}
