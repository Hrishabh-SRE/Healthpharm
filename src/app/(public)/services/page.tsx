import { PageHeader } from "@/components/public/PageHeader";
import { ServiceCard } from "@/components/public/ServiceCard";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { services } from "@/content/services";

export default function ServicesPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Services"
        description="Explore our nutrition and healthcare support services designed for different goals and care needs."
      />
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
