import Link from "next/link";

import type { ServiceContent } from "@/content/services";
import { PUBLIC_ROUTES } from "@/lib/utils/routes";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/public/PageHeader";
import { Section } from "@/components/shared/Section";

type ServiceDetailTemplateProps = {
  service: ServiceContent;
};

export function ServiceDetailTemplate({ service }: ServiceDetailTemplateProps): React.JSX.Element {
  return (
    <>
      <PageHeader title={service.title} description={service.shortDescription} />
      <Section>
        <Container className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
            <p className="mt-2 text-slate-600">{service.overview}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Who this is for</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {service.whoItsFor?.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900">What is included</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {service.included?.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900">How the process works</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {service.process?.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-primary-light p-6">
            <h3 className="text-xl font-semibold text-slate-900">Ready to talk to a dietician?</h3>
            <p className="mt-2 text-sm text-slate-700">
              Book a consultation for personalized guidance designed to support your health goals.
            </p>
            <Button className="mt-4" asChild>
              <Link href={PUBLIC_ROUTES.BOOK_CONSULTATION}>Book Consultation</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
