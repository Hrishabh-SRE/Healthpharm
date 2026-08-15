import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { expertisePoints } from "@/content/expertise";

export default function ExpertisePage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Our Expertise and Care Approach"
        description="We combine structured nutrition planning, clinical context, and follow-up support for sustainable progress."
      />
      <Section>
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {expertisePoints.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 p-5">
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
