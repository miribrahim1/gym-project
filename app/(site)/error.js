"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function SiteError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="flex min-h-[60vh] items-center justify-center text-center">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-bone-50">Something Went Wrong</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-bone-400">
          We hit an unexpected error loading this page. Please try again.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset} icon={RefreshCcw}>Try Again</Button>
          <Button href="/" variant="secondary">Back to Home</Button>
        </div>
      </div>
    </Section>
  );
}
