import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { experts } from "@/content/experts";

export default function DoctorsPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Doctors and Experts"
        description="Our team includes experienced professionals offering personalized, evidence-informed nutrition support."
      />
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experts.map((expert) => (
              <Card key={expert.name}>
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light font-semibold text-primary-dark">
                    {expert.imagePlaceholder}
                  </div>
                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                  <p className="text-sm text-slate-600">{expert.role}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Qualification:</span> {expert.qualification}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Specialization:</span> {expert.specialization}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Experience:</span> {expert.experience}
                  </p>
                  <p>{expert.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
