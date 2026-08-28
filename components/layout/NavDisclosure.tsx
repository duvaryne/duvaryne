"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";

/**
 * Mobile disclosure for the primary nav.
 *
 * The nav links themselves are passed in as `children` from the server component, so they
 * are rendered once into the RSC payload and exist in the DOM exactly once — the old site
 * shipped three duplicate <nav> blocks and tripled its internal link graph (defect 20).
 * This component contributes only the open/close state.
 */
export function NavDisclosure({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Escape closes; body scroll locks while the sheet covers the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-heading transition-colors duration-150 hover:bg-tint lg:hidden"
      >
        {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
      </button>

      <div
        id={panelId}
        data-open={open}
        className="hidden data-[open=true]:absolute data-[open=true]:inset-x-0 data-[open=true]:top-full data-[open=true]:block data-[open=true]:border-t data-[open=true]:border-rule data-[open=true]:bg-surface data-[open=true]:p-5 data-[open=true]:shadow-lg lg:!static lg:!block lg:!border-0 lg:!bg-transparent lg:!p-0 lg:!shadow-none"
        onClick={() => setOpen(false)}
      >
        {children}
      </div>
    </>
  );
}
