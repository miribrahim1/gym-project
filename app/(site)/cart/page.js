import { Section, SectionHeading } from "@/components/ui/Section";
import CartView from "@/components/supplements/CartView";

export const metadata = { title: "Your Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <Section className="pt-14">
      <SectionHeading eyebrow="Supplements" title="Your Cart" />
      <div className="mt-12">
        <CartView />
      </div>
    </Section>
  );
}
