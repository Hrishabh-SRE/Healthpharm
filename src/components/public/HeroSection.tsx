import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { PUBLIC_ROUTES } from "@/lib/utils/routes";

export function HeroSection(): React.JSX.Element {
  return (
    <Section className="bg-gradient-to-b from-blue-50 to-white">
      <Container className="grid gap-8 py-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-dark">Healthcare Dietician Portal</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{siteConfig.tagline}</h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">{siteConfig.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={PUBLIC_ROUTES.BOOK_CONSULTATION}>Book Consultation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={PUBLIC_ROUTES.SERVICES}>View Services</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Dietician-Led, Evidence-Informed Care</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>- Personalized nutrition strategy</li>
            <li>- Clinical and lifestyle-aware support</li>
            <li>- Structured progress tracking</li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
