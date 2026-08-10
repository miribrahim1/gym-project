import { MapPin, Phone, Mail, MessageCircle, Clock, Navigation } from "lucide-react";
import { getSettings } from "@/lib/db/settings";
import { Section, SectionHeading } from "@/components/ui/Section";
import ContactForm from "@/components/contact/ContactForm";
import Button from "@/components/ui/Button";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with IronVault Fitness — visit us, call, WhatsApp or send a message.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsapp = (settings.whatsapp || "").replace(/[^\d+]/g, "");
  const mapsQuery = encodeURIComponent(settings.address);

  return (
    <Section className="pt-14">
      <SectionHeading eyebrow="Get In Touch" title="Contact Us" description="Have a question about membership, classes or nutrition coaching? Reach out — we're happy to help." />

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
            <ul className="space-y-5">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-medium text-bone-100">Address</p>
                  <p className="mt-0.5 text-sm text-bone-500">{settings.address}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-medium text-bone-100">Phone</p>
                  <a href={`tel:${settings.phone}`} className="mt-0.5 block text-sm text-bone-500 hover:text-gold-400">{settings.phone}</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-medium text-bone-100">Email</p>
                  <a href={`mailto:${settings.email}`} className="mt-0.5 block text-sm text-bone-500 hover:text-gold-400">{settings.email}</a>
                </div>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-medium text-bone-100">WhatsApp</p>
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-0.5 block text-sm text-bone-500 hover:text-gold-400">{settings.whatsapp}</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-medium text-bone-100">Opening Hours</p>
                  <p className="mt-0.5 text-sm text-bone-500">Mon–Fri: {settings.hours.weekday}</p>
                  <p className="text-sm text-bone-500">Saturday: {settings.hours.saturday}</p>
                  <p className="text-sm text-bone-500">Sunday: {settings.hours.sunday}</p>
                </div>
              </li>
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Button href={`tel:${settings.phone}`} variant="secondary" size="sm" icon={Phone}>Call</Button>
              <Button href={`https://wa.me/${whatsapp}`} variant="secondary" size="sm" icon={MessageCircle}>WhatsApp</Button>
              <Button href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} variant="secondary" size="sm" icon={Navigation}>Directions</Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ink-700">
            <PlaceholderImage tone="slate" icon="MapPin" ratio="square" label="IronVault Fitness — Koramangala, Bengaluru" size={44} />
          </div>
        </div>
      </div>
    </Section>
  );
}
