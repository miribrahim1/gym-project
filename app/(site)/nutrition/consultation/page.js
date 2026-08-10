import { listNutritionists } from "@/lib/db/nutrition";
import { Section, SectionHeading } from "@/components/ui/Section";
import ConsultationBooking from "@/components/nutrition/ConsultationBooking";

export const metadata = {
  title: "Book Nutrition Consultation",
  description: "Book a 1-on-1 nutrition consultation with an IronVault nutrition coach.",
  alternates: { canonical: "/nutrition/consultation" },
};

export default async function NutritionConsultationPage() {
  const nutritionists = await listNutritionists();

  return (
    <Section className="pt-14">
      <SectionHeading eyebrow="Nutrition Lab" title="Book Your Consultation" description="Choose a nutritionist, pick a time, and confirm — no payment required for this demo." />
      <div className="mt-12">
        <ConsultationBooking nutritionists={nutritionists} />
      </div>
    </Section>
  );
}
