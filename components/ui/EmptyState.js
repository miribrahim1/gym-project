import * as Icons from "lucide-react";

export default function EmptyState({ icon = "SearchX", title, description, action }) {
  const Icon = Icons[icon] || Icons.SearchX;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-600 bg-ink-900/40 px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-ink-800 text-gold-400">
        <Icon className="size-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-2xl tracking-wide text-bone-100">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm text-bone-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
