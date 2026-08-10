import Link from "next/link";
import { listGalleryImages } from "@/lib/db/gallery";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

const SPANS = ["row-span-2", "", "", "row-span-2", "", ""];

export default async function GalleryPreview() {
  const images = await listGalleryImages();
  const featured = images.slice(0, 6);

  return (
    <Section className="bg-ink-900/40">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow="Inside IronVault" title="The Gallery" description="A look at our floor, our classes and our community in action." />
        <Button href="/gallery" variant="secondary" icon={ArrowRight} iconPosition="right" className="shrink-0">
          Open Full Gallery
        </Button>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-rows-2">
        {featured.map((image, i) => (
          <Reveal key={image.id} delay={i * 50} className={SPANS[i]}>
            <Link href="/gallery" className="block h-full">
              <PlaceholderImage
                src={image.image}
                tone={image.tone}
                icon="Image"
                label={image.caption}
                ratio={SPANS[i] ? "portrait" : "square"}
                className="h-full rounded-xl transition-transform duration-500 hover:scale-[1.02]"
                size={30}
              />
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
