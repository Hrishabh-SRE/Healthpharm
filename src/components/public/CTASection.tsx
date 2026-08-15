import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/lib/utils/routes";

export function CTASection(): React.JSX.Element {
  return (
    <Section className="bg-primary-light">
      <Container className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Start Your Nutrition Journey With Expert Guidance</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Book a consultation to discuss your goals and receive personalized, dietician-led recommendations.
        </p>
        <Button className="mt-6" asChild>
          <Link href={PUBLIC_ROUTES.BOOK_CONSULTATION}>Book Consultation</Link>
        </Button>
      </Container>
    </Section>
  );
}
