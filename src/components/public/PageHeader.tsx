import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";

type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps): React.JSX.Element {
  return (
    <Section className="border-b border-slate-200 bg-slate-50">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600">{description}</p>
      </Container>
    </Section>
  );
}
