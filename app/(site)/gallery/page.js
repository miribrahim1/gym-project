import { listGalleryImages, listGalleryCategories } from "@/lib/db/gallery";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import GalleryBoard from "@/components/gallery/GalleryBoard";

export const metadata = {
  title: "Gallery",
  description: "A look inside IronVault Fitness — our gym floor, training sessions, classes, trainers, community and events.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const [images, categories] = await Promise.all([listGalleryImages(), listGalleryCategories()]);

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/gallery/01-main-floor.jpg" tone="slate" icon="Camera" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Inside IronVault</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">Gallery</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${images.length} Photos`} title="A Look Inside" description="Our floor, our classes, our trainers and our community." />
        <div className="mt-12">
          <GalleryBoard images={images} categories={categories} />
        </div>
      </Section>
    </>
  );
}
