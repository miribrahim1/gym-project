import Link from "next/link";
import { ShieldCheck, Info } from "lucide-react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = { title: "Sign In" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 bg-noise px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-md border border-gold-500/50 bg-gold-500/10">
              <span className="font-display text-xl text-gold-400">IV</span>
            </span>
            <span className="font-display text-2xl tracking-widest text-bone-50">IRONVAULT</span>
          </Link>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-bone-500">
            <ShieldCheck className="size-3.5 text-gold-400" /> Admin Dashboard
          </p>
        </div>

        <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-8">
          <h1 className="font-display text-2xl tracking-wide text-bone-50">Sign In</h1>
          <p className="mt-1 text-sm text-bone-500">Access the IronVault Fitness admin dashboard.</p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-gold-500/20 bg-gold-500/[0.05] px-4 py-3 text-xs text-bone-400">
          <Info className="mt-0.5 size-4 shrink-0 text-gold-400" />
          <p>
            Demo credentials — Email: <span className="text-bone-200">admin@ironvaultfitness.com</span> · Password:{" "}
            <span className="text-bone-200">ironvault2026</span>
          </p>
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="text-xs text-bone-500 hover:text-gold-400">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
