"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Contrast, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Theme control — light, dark, high contrast, and "system" as the default.
 *
 * The stored value is read by an inline script in the document head, before first paint,
 * so the correct theme is applied without a flash. This component only writes; it must
 * never be what applies the theme on load, because by the time React hydrates the wrong
 * palette has already been painted.
 *
 * Four states rather than three: "system" is a real choice, and collapsing it into light
 * means a visitor who prefers dark at the OS level and never touches this control gets
 * light forever.
 */

const MODES = ["dark", "light", "contrast"] as const;
type Mode = (typeof MODES)[number];

const META: Record<Mode, { label: string; Icon: typeof Sun }> = {
  dark: { label: "Dark", Icon: Moon },
  light: { label: "Light", Icon: Sun },
  contrast: { label: "High contrast", Icon: Contrast },
};

function apply(mode: Mode) {
  const root = document.documentElement;
  // Dark is what :root already is, so it is expressed by removing the attribute
  // rather than by stamping one. That keeps the default and the explicit choice
  // rendering through exactly the same declarations.
  if (mode === "dark") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  try {
    localStorage.setItem("duvaryne-theme", mode);
  } catch {
    // Private browsing, or site data blocked. The theme still applies for this page view.
  }
}

/**
 * localStorage is external state, so it is read through useSyncExternalStore rather than
 * an effect. Reading it in useEffect and calling setState works, but it renders once with
 * the wrong value and then again with the right one — a cascading render the linter
 * correctly objects to, and a flash of the wrong label on every mount.
 */
function subscribe(onChange: () => void) {
  // `storage` fires when another tab changes the preference, keeping tabs in sync.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSnapshot(): Mode {
  try {
    const v = localStorage.getItem("duvaryne-theme");
    if (v && (MODES as readonly string[]).includes(v)) return v as Mode;
  } catch {
    // Private browsing or blocked site data — "system" is the correct fallback.
  }
  return "dark";
}

/** The server cannot read a stored preference; the shipped default is dark. */
const getServerSnapshot = (): Mode => "dark";

export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const cycle = useCallback(() => {
    const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length]!;
    apply(next);
    // Same-document writes do not fire `storage`, so nudge our own subscribers.
    window.dispatchEvent(new Event("storage"));
  }, [mode]);

  const { label, Icon } = META[mode];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}. Activate to change.`}
      title={`Theme: ${label}`}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center border border-rule",
        "text-muted transition-colors duration-150",
        "hover:border-action hover:text-fg",
        className,
      )}
    >
      <Icon size={17} aria-hidden />
      <span className="sr-only">{label}</span>
    </button>
  );
}

/**
 * Runs before paint. Kept as a string rather than a module because it has to execute
 * synchronously in the head — anything deferred or hydrated is already too late.
 */
export const themeScript = `(function(){try{
var m=localStorage.getItem('duvaryne-theme');
if(m==='light'||m==='contrast'){document.documentElement.setAttribute('data-theme',m);}
}catch(e){}})();`;
