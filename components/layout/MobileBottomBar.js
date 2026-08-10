import { Phone, MessageCircle, Dumbbell } from "lucide-react";
import Link from "next/link";

export default function MobileBottomBar({ settings }) {
  const whatsapp = (settings.whatsapp || "").replace(/[^\d+]/g, "");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex xl:hidden border-t border-ink-700 bg-ink-950/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <a
        href={`tel:${settings.phone}`}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-bone-300 active:bg-ink-800"
      >
        <Phone className="size-[18px]" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Call</span>
      </a>
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-bone-300 active:bg-ink-800"
      >
        <MessageCircle className="size-[18px]" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">WhatsApp</span>
      </a>
      <Link
        href="/membership/signup"
        className="flex flex-1 flex-col items-center justify-center gap-1 bg-gold-500 py-2.5 text-ink-950 active:bg-gold-400"
      >
        <Dumbbell className="size-[18px]" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Join Now</span>
      </Link>
    </div>
  );
}
