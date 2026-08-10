import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-lg bg-ink-700/60", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-800/40">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6, columns = "sm:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={cn("grid grid-cols-1 gap-6", columns)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
