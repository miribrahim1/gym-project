import { Section, SectionHeading } from "@/components/ui/Section";
import CheckoutForm from "@/components/supplements/CheckoutForm";

export const metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Section className="pt-14">
      <SectionHeading eyebrow="Supplements" title="Checkout" />
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </Section>
  );
}
