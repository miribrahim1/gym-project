"use client";

import { useEffect } from "react";
import { RefreshCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#08080a] px-4 text-center text-[#f2f1ee]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6a04a]">IronVault Fitness</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-wide">Something Went Wrong</h1>
        <p className="mt-4 max-w-md text-sm text-[#86847e]">
          We hit an unexpected error. Please try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#c6a04a] px-6 text-sm font-semibold uppercase tracking-wider text-[#08080a] hover:bg-[#d4af5f]"
          >
            <RefreshCcw className="size-4" /> Try Again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- root error boundary replaces the root layout, so next/link's router context is not guaranteed to be mounted here */}
          <a
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold uppercase tracking-wider hover:border-[#c6a04a]/60"
          >
            <Home className="size-4" /> Home
          </a>
        </div>
      </body>
    </html>
  );
}
