import { CTASection } from "@/components/public/CTASection";
import { ContactSection } from "@/components/public/ContactSection";
import { ExpertiseSection } from "@/components/public/ExpertiseSection";
import { ExpertsPreview } from "@/components/public/ExpertsPreview";
import { HeroSection } from "@/components/public/HeroSection";
import { ServicesSection } from "@/components/public/ServicesSection";

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ExpertiseSection />
      <ExpertsPreview />
      <CTASection />
      <ContactSection />
    </>
  );
}
