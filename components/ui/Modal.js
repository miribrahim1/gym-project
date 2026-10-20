"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function Modal({ open, onClose, title, children, className, size = "md" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog ref={dialogRef} aria-label={title} onCancel={(event) => { event.preventDefault(); onClose?.(); }} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-inherit backdrop:bg-transparent">
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className={cn(
          "relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-2xl border border-ink-600 bg-ink-900 shadow-2xl animate-fade-up",
          size === "sm" && "max-w-md",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-2xl",
          size === "xl" && "max-w-4xl",
          className
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-700 bg-ink-900/95 px-6 py-4 backdrop-blur">
          <h2 className="font-display text-xl tracking-wide text-bone-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-bone-400 transition-colors hover:bg-ink-700 hover:text-bone-50"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
    </dialog>
  );
}
