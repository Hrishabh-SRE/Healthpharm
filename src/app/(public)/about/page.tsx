import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";

const highlights = [
  {
    title: "Company Mission",
    description:
      "To make high-quality, personalized nutrition guidance accessible, practical, and sustainable for diverse health needs.",
  },
  {
    title: "Approach to Nutrition",
    description:
      "We use evidence-informed planning, client context, and measurable follow-up to design plans that support long-term change.",
  },
  {
    title: "Client-First Care",
    description:
      "Every recommendation is built around your goals, routine, and preferences to improve adherence and daily usability.",
  },
  {
    title: "Expert-Led Guidance",
    description:
      "Dieticians and healthcare experts collaborate to deliver safe, personalized, and structured support.",
  },
  {
    title: "Future Digital Dashboard Support",
    description:
      "Our portal is being expanded to support clients, dieticians, and admins with coordinated digital care workflows.",
  },
];

export default function AboutPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="About Our Company"
        description="A healthcare and nutrition team focused on personalized guidance, continuity of care, and measurable progress."
      />
      <Section>
        <Container className="space-y-4">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </article>
          ))}
        </Container>
      </Section>
    </>
  );
}
