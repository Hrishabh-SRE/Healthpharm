import { expertisePoints } from "@/content/expertise";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";

export function ExpertiseSection(): React.JSX.Element {
  return (
    <Section>
      <Container>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why Choose Our Expertise</h2>
        <p className="mt-2 text-slate-600">
          We combine personalized planning, progress tracking, and dietician follow-up to support long-term health outcomes.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {expertisePoints.slice(0, 6).map((point) => (
            <div key={point.title} className="rounded-lg border border-primary/15 bg-gradient-to-br from-white to-blue-50/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-blue-100/60">
              <h3 className="text-lg font-semibold text-slate-900">{point.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{point.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
