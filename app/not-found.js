import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 bg-noise px-4 text-center">
      <p className="font-display text-8xl text-gold-500/40">404</p>
      <h1 className="font-display mt-2 text-4xl tracking-wide text-bone-50">Page Not Found</h1>
      <p className="mt-4 max-w-md text-sm text-bone-400">The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-gold-500 px-6 text-sm font-semibold uppercase tracking-wider text-ink-950 transition-colors hover:bg-gold-400"
      >
        Back to Home
      </Link>
    </div>
  );
}
