import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const VARIANTS = {
  primary:
    "bg-gold-500 text-ink-950 hover:bg-gold-400 shadow-[0_0_0_1px_rgba(198,160,74,0.3)] hover:shadow-[0_0_24px_-4px_rgba(198,160,74,0.55)]",
  secondary:
    "bg-transparent text-bone-100 border border-bone-100/25 hover:border-gold-400/70 hover:text-gold-300",
  ghost: "bg-transparent text-bone-100 hover:bg-ink-700/60",
  danger: "bg-ember-600 text-bone-50 hover:bg-ember-500",
  dark: "bg-ink-800 text-bone-100 border border-ink-600 hover:border-gold-500/60",
};

const SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export default function Button({
  as,
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold uppercase tracking-wider transition-all duration-300 ease-out disabled:opacity-40 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  const content = (
    <>
      {Icon && iconPosition === "left" ? <Icon className="size-4" aria-hidden /> : null}
      <span>{children}</span>
      {Icon && iconPosition === "right" ? <Icon className="size-4" aria-hidden /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  const Comp = as || "button";
  return (
    <Comp className={classes} {...props}>
      {content}
    </Comp>
  );
}
