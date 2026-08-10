"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CreditCard, Contact, CalendarDays, ClipboardCheck, Dumbbell, Apple,
  ShoppingBag, PackageCheck, Sparkles, Quote, PartyPopper, Newspaper, Images, Building2,
  MessageSquare, Settings, Menu, X, LogOut, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { logoutAdmin } from "@/lib/actions/auth";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "People & Access",
    items: [
      { href: "/admin/members", label: "Members", icon: Users },
      { href: "/admin/memberships", label: "Memberships", icon: CreditCard },
      { href: "/admin/trainers", label: "Trainers", icon: Contact },
    ],
  },
  {
    label: "Training",
    items: [
      { href: "/admin/classes", label: "Classes", icon: CalendarDays },
      { href: "/admin/bookings", label: "Bookings", icon: ClipboardCheck },
      { href: "/admin/programs", label: "Programs", icon: Dumbbell },
    ],
  },
  {
    label: "Nutrition & Store",
    items: [
      { href: "/admin/nutrition", label: "Nutrition", icon: Apple },
      { href: "/admin/supplements", label: "Supplements", icon: ShoppingBag },
      { href: "/admin/orders", label: "Orders", icon: PackageCheck },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/transformations", label: "Transformations", icon: Sparkles },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/events", label: "Events", icon: PartyPopper },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/facilities", label: "Facilities", icon: Building2 },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminShell({ settings, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ink-950 bg-noise lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-ink-700 bg-ink-900/60 lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} settings={settings} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-100 lg:hidden transition-opacity duration-300",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-72 border-r border-ink-700 bg-ink-900 transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
            <span className="font-display text-lg tracking-widest text-bone-50">{settings.logoText}</span>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-bone-400 hover:text-bone-50">
              <X className="size-5" />
            </button>
          </div>
          <SidebarContent pathname={pathname} settings={settings} onNavigate={() => setMobileOpen(false)} />
        </aside>
      </div>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-700 bg-ink-950/90 px-4 py-3.5 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-bone-300 hover:bg-ink-800 lg:hidden">
              <Menu className="size-5" />
            </button>
            <p className="text-sm text-bone-500">
              Welcome back, <span className="text-bone-100">Admin</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 text-xs text-bone-500 hover:text-gold-400 sm:flex">
              View Site <ExternalLink className="size-3.5" />
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="flex items-center gap-1.5 rounded-full border border-ink-600 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-bone-300 hover:border-ember-500/60 hover:text-ember-500">
                <LogOut className="size-3.5" /> Logout
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, settings, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="hidden border-b border-ink-700 px-5 py-5 lg:block">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md border border-gold-500/50 bg-gold-500/10">
            <span className="font-display text-lg text-gold-400">IV</span>
          </span>
          <span className="font-display text-lg tracking-widest text-bone-50">{settings.logoText}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-bone-600">{section.label}</p>
            <div className="mt-2 space-y-0.5">
              {section.items.map((item) => {
                const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active ? "bg-gold-500/10 text-gold-400" : "text-bone-300 hover:bg-ink-800 hover:text-bone-50"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
