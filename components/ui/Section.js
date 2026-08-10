import { cn } from "@/lib/utils/cn";

export function Section({ className, children, id, ...props }) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)} {...props}>
      <div className="container-app">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className }) {
  return (
    <div className={cn("flex items-center gap-3 text-gold-400", className)}>
      <span className="h-px w-8 bg-gold-500/70" aria-hidden />
      <span className="text-xs font-semibold uppercase tracking-[0.28em]">{children}</span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display mt-4 text-4xl leading-[0.95] tracking-wide text-bone-50 sm:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-bone-400">{description}</p> : null}
    </div>
  );
}
