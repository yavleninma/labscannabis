"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitThemeChange() {
  listeners.forEach((listener) => listener());
}

function getThemeSnapshot() {
  return typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  function toggle() {
    const next = !dark;
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
    emitThemeChange();
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="px-2 py-1 rounded-full border border-border text-[13px] hover:bg-bg-card-hover transition-colors"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
