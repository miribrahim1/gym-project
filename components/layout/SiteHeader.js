"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, UserCircle2, ChevronRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/supplements/CartProvider";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Membership", href: "/membership" },
  { label: "Trainers", href: "/trainers" },
  { label: "Classes", href: "/classes" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Supplements", href: "/supplements" },
  { label: "Transformations", href: "/transformations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  // Close the mobile drawer/search on navigation. Adjusted during render
  // (React's recommended pattern for "reset state when a prop changes")
  // rather than an effect, so it takes effect before the new route paints.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "border-b border-ink-700 bg-ink-950/90 backdrop-blur-md" : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-app flex h-18 items-center py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${settings.gymName} home`}>
            <span className="flex size-9 items-center justify-center rounded-md border border-gold-500/50 bg-gold-500/10">
              <span className="font-display text-lg text-gold-400">IV</span>
            </span>
            <span className="font-display text-xl tracking-widest text-bone-50">
              {settings.logoText || "IRONVAULT"}
            </span>
          </Link>

          <nav className="hidden xl:flex flex-1 items-center justify-center gap-4 2xl:gap-6" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative inline-flex flex-col items-center py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:text-gold-400",
                    active ? "text-gold-400" : "text-bone-200"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-400 transition-transform duration-300 ease-out group-hover:scale-x-100",
                      active && "scale-x-100"
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          {/* Compact nav for lg screens (below the full xl list) */}
          <nav className="hidden lg:flex xl:hidden flex-1 items-center justify-center gap-4" aria-label="Primary">
            {NAV_LINKS.slice(0, 7).map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative inline-flex flex-col items-center py-2 text-[11px] font-medium uppercase tracking-wider transition-colors hover:text-gold-400",
                    active ? "text-gold-400" : "text-bone-200"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-400 transition-transform duration-300 ease-out group-hover:scale-x-100",
                      active && "scale-x-100"
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              aria-label="Search the site"
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden sm:flex size-10 items-center justify-center rounded-full text-bone-200 transition-colors hover:bg-ink-700/60 hover:text-gold-400"
            >
              <Search className="size-[18px]" />
            </button>
            <Link
              href="/admin"
              aria-label="Member / Admin login"
              className="hidden sm:flex size-10 items-center justify-center rounded-full text-bone-200 transition-colors hover:bg-ink-700/60 hover:text-gold-400"
            >
              <UserCircle2 className="size-[18px]" />
            </Link>
            <Link
              href="/cart"
              aria-label={`View cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative flex size-10 items-center justify-center rounded-full text-bone-200 transition-colors hover:bg-ink-700/60 hover:text-gold-400"
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 ? (
                <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink-950">
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
            </Link>
            <Button href="/membership/signup" size="sm" className="hidden md:inline-flex">
              Join Now
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="flex xl:hidden size-10 items-center justify-center rounded-full text-bone-100 transition-colors hover:bg-ink-700/60"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {searchOpen ? <SearchBar onClose={() => setSearchOpen(false)} /> : null}
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} settings={settings} pathname={pathname} />
    </>
  );
}

function SearchBar({ onClose }) {
  return (
    <div className="border-t border-ink-700 bg-ink-950/95 backdrop-blur">
      <form action="/blog" className="container-app flex items-center gap-3 py-4">
        <Search className="size-4 shrink-0 text-gold-400" />
        <input
          autoFocus
          type="search"
          name="q"
          placeholder="Search programs, classes, articles…"
          className="w-full bg-transparent text-sm text-bone-100 placeholder:text-bone-500 focus:outline-none"
        />
        <button type="button" onClick={onClose} aria-label="Close search" className="text-bone-400 hover:text-bone-100">
          <X className="size-4" />
        </button>
      </form>
    </div>
  );
}

function MobileDrawer({ open, onClose, settings, pathname }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-100 xl:hidden transition-all duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto border-l border-ink-700 bg-ink-900 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <span className="font-display text-lg tracking-widest text-bone-50">{settings.logoText || "IRONVAULT"}</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-full p-2 text-bone-300 hover:bg-ink-700 hover:text-bone-50">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex flex-col px-2 py-3" aria-label="Mobile primary">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-4 py-3.5 text-sm font-medium uppercase tracking-wider transition-colors",
                  active ? "bg-gold-500/10 text-gold-400" : "text-bone-200 hover:bg-ink-800"
                )}
              >
                {link.label}
                <ChevronRight className="size-4 opacity-50" />
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t border-ink-700 px-5 py-5">
          <Button href="/membership/signup" className="w-full">
            Join Now
          </Button>
          <Button href="/admin" variant="secondary" className="w-full">
            Member / Admin Login
          </Button>
        </div>
      </div>
    </div>
  );
}
