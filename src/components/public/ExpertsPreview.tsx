import Link from "next/link";

import { experts } from "@/content/experts";
import { PUBLIC_ROUTES } from "@/lib/utils/routes";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExpertsPreview(): React.JSX.Element {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Doctors and Experts</h2>
            <p className="mt-2 text-slate-600">Meet the team guiding your nutrition journey.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href={PUBLIC_ROUTES.DOCTORS}>View All</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {experts.map((expert) => (
            <Card key={expert.name}>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light font-semibold text-primary-dark">
                  {expert.imagePlaceholder}
                </div>
                <CardTitle className="text-lg">{expert.name}</CardTitle>
                <p className="text-sm text-slate-600">{expert.role}</p>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">{expert.specialization}</CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
