import Link from "next/link";
import { Camera, Users2, Clapperboard, AtSign, MapPin, Phone, Mail, Clock } from "lucide-react";

const QUICK_LINKS = [
  { label: "Programs", href: "/programs" },
  { label: "Membership", href: "/membership" },
  { label: "Trainers", href: "/trainers" },
  { label: "Classes", href: "/classes" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Supplements", href: "/supplements" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Transformations", href: "/transformations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Facilities", href: "/facilities" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
];

const SUPPORT_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Personal Training", href: "/personal-training" },
  { label: "Admin Login", href: "/admin/login" },
];

export default function Footer({ settings }) {
  const socials = [
    { icon: Camera, href: settings.social?.instagram, label: "Instagram" },
    { icon: Users2, href: settings.social?.facebook, label: "Facebook" },
    { icon: Clapperboard, href: settings.social?.youtube, label: "YouTube" },
    { icon: AtSign, href: settings.social?.twitter, label: "Twitter / X" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md border border-gold-500/50 bg-gold-500/10">
                <span className="font-display text-lg text-gold-400">IV</span>
              </span>
              <span className="font-display text-xl tracking-widest text-bone-50">{settings.logoText}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-500">{settings.tagline}</p>
            {socials.length ? (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full border border-ink-600 text-bone-400 transition-colors hover:border-gold-500/60 hover:text-gold-400"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <FooterColumn title="Explore" links={QUICK_LINKS} className="lg:col-span-2" />
          <FooterColumn title="Company" links={COMPANY_LINKS} className="lg:col-span-2" />
          <FooterColumn title="Support" links={SUPPORT_LINKS} className="lg:col-span-2" />

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-bone-500">Visit Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-bone-400">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="size-4 shrink-0 text-gold-400" />
                <a href={`tel:${settings.phone}`} className="hover:text-bone-100">{settings.phone}</a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="size-4 shrink-0 text-gold-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-bone-100 break-all">{settings.email}</a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span>Mon–Fri {settings.hours?.weekday}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-700">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-6 text-xs text-bone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.gymName}. All rights reserved. Demo site for portfolio purposes.</p>
          <div className="flex gap-5">
            <Link href="/faq" className="hover:text-bone-200">FAQ</Link>
            <Link href="/contact" className="hover:text-bone-200">Contact</Link>
            <Link href="/admin/login" className="hover:text-bone-200">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, className }) {
  return (
    <div className={className}>
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-bone-500">{title}</h4>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-bone-400 transition-colors hover:text-gold-400">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
