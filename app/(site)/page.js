import { getSettings } from "@/lib/db/settings";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import MembershipPreview from "@/components/home/MembershipPreview";
import TrainersPreview from "@/components/home/TrainersPreview";
import TransformationsPreview from "@/components/home/TransformationsPreview";
import Testimonials from "@/components/home/Testimonials";
import GalleryPreview from "@/components/home/GalleryPreview";
import FAQPreview from "@/components/home/FAQPreview";
import CTABanner from "@/components/home/CTABanner";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: "Premium Strength & Fitness Club",
    description: settings.tagline + " Elite personal training, group classes, nutrition coaching and a high-performance community in Bengaluru.",
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const settings = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: settings.gymName,
    description: settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
    },
    openingHours: [`Mo-Fr ${settings.hours.weekday}`, `Sa ${settings.hours.saturday}`, `Su ${settings.hours.sunday}`],
    sameAs: Object.values(settings.social || {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero settings={settings} />
      <WhyChooseUs />
      <ProgramsPreview />
      <MembershipPreview />
      <TrainersPreview />
      <TransformationsPreview />
      <Testimonials />
      <GalleryPreview />
      <FAQPreview />
      <CTABanner settings={settings} />
    </>
  );
}
