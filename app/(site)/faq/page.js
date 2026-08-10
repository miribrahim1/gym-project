import { listFaqs } from "@/lib/db/faqs";
import { Section, SectionHeading } from "@/components/ui/Section";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about IronVault Fitness memberships, classes, personal training and nutrition.",
  alternates: { canonical: "/faq" },
};

export default async function FAQPage() {
  const faqs = await listFaqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Section className="pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" align="center" className="mx-auto" />
      <div className="mx-auto mt-12 max-w-3xl">
        <Accordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} defaultOpenIndex={0} />
      </div>
      <div className="mt-12 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-bone-500">Still have questions?</p>
        <Button href="/contact">Contact Our Team</Button>
      </div>
    </Section>
  );
}
