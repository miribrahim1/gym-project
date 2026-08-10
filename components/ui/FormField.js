import { cn } from "@/lib/utils/cn";

const fieldBase =
  "w-full rounded-lg border bg-ink-900/80 px-4 py-3 text-sm text-bone-100 placeholder:text-bone-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40";

export function Label({ children, htmlFor, className }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-wider text-bone-400", className)}>
      {children}
    </label>
  );
}

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(fieldBase, error ? "border-ember-500/70" : "border-ink-600 focus:border-gold-500/60", className)}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );
}

export function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-32 resize-y", error ? "border-ember-500/70" : "border-ink-600 focus:border-gold-500/60", className)}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );
}

export function Select({ className, error, children, ...props }) {
  return (
    <select
      className={cn(fieldBase, "appearance-none", error ? "border-ember-500/70" : "border-ink-600 focus:border-gold-500/60", className)}
      aria-invalid={error ? "true" : undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs text-ember-500">{children}</p>;
}

export function FieldGroup({ children, className }) {
  return <div className={cn("mb-5", className)}>{children}</div>;
}
