import { listFaqs } from "@/lib/db/faqs";
import { Section, SectionHeading } from "@/components/ui/Section";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default async function FAQPreview() {
  const faqs = await listFaqs();
  const featured = faqs.slice(0, 5).map((f) => ({ id: f.id, question: f.question, answer: f.answer }));

  return (
    <Section>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" description="Everything you need to know before joining IronVault." />
          <Button href="/faq" variant="secondary" icon={ArrowRight} iconPosition="right" className="mt-8">
            View Full FAQ
          </Button>
        </div>
        <div className="lg:col-span-8">
          <Accordion items={featured} defaultOpenIndex={0} />
        </div>
      </div>
    </Section>
  );
}
