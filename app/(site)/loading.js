import { Section } from "@/components/ui/Section";
import { GridSkeleton } from "@/components/ui/Skeleton";

export default function SiteLoading() {
  return (
    <Section className="pt-20">
      <GridSkeleton count={6} />
    </Section>
  );
}
