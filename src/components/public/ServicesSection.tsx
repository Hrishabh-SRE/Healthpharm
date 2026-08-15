import { services } from "@/content/services";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { ServiceCard } from "@/components/public/ServiceCard";

export function ServicesSection(): React.JSX.Element {
  return (
    <Section>
      <Container>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Our Services</h2>
        <p className="mt-2 text-slate-600">Personalized programs designed to support different health and nutrition goals.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
