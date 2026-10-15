import Link from "next/link";

import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { siteConfig } from "@/content/site";
import { PUBLIC_ROUTES } from "@/lib/utils/routes";

export function ContactSection(): React.JSX.Element {
  return (
    <Section className="border-t border-primary/10 bg-gradient-to-b from-white to-blue-50/40">
      <Container className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contact Our Team</h2>
          <p className="mt-2 text-slate-600">
            Reach out for service information, consultation planning, or to connect with a dietician.
          </p>
          <p className="mt-4 text-sm text-slate-600">Email: {siteConfig.contactEmail}</p>
          <p className="text-sm text-slate-600">Phone: {siteConfig.contactPhone}</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-white p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-blue-100/70">
          <h3 className="text-lg font-semibold text-slate-900">Need a personalized consultation?</h3>
          <p className="mt-2 text-sm text-slate-600">Submit your details and our team will get back to you soon.</p>
          <Link
            href={PUBLIC_ROUTES.BOOK_CONSULTATION}
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primary-dark"
          >
            Book Consultation -&gt;
          </Link>
        </div>
      </Container>
    </Section>
  );
}
