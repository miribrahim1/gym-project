import { listSupplements, listSupplementCategories } from "@/lib/db/supplements";
import { Section, SectionHeading } from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StoreBoard from "@/components/supplements/StoreBoard";

export const metadata = {
  title: "Supplements Store",
  description: "Shop the IronVault Fitness supplement range — Whey Protein, Creatine, Pre-Workout, BCAA, Electrolytes, Multivitamins, Protein Bars and Recovery Formula.",
  alternates: { canonical: "/supplements" },
};

export default async function SupplementsPage() {
  const [products, categories] = await Promise.all([listSupplements(), listSupplementCategories()]);

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-700">
        <PlaceholderImage src="/images/supplements/supplements-banner.jpg" tone="amber" icon="ShoppingBag" ratio="banner" className="h-full w-full" size={0} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">IronVault Supplements</p>
          <h1 className="font-display mt-3 text-5xl tracking-wide text-bone-50 sm:text-6xl">The Supplement Store</h1>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={`${products.length} Products`} title="Fuel Your Training" description="Our in-house supplement range, formulated to support every stage of your training." />
        <div className="mt-12">
          <StoreBoard products={products} categories={categories} />
        </div>
      </Section>
    </>
  );
}
