import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { siteConfig } from "@/content/site";

export default function ContactPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Contact"
        description="Connect with our team for service details, consultation queries, and nutrition guidance support."
      />
      <Section>
        <Container className="grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Contact Information</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Email: {siteConfig.contactEmail}</p>
              <p>Phone: {siteConfig.contactPhone}</p>
              <p>Address: {siteConfig.address}</p>
              <p>Working Hours: {siteConfig.workingHours}</p>
            </div>
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Map placeholder - add map integration in a future phase.
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
