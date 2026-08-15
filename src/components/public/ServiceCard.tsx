import Link from "next/link";

import type { ServiceContent } from "@/content/services";
import { PUBLIC_ROUTES } from "@/lib/utils/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceCardProps = {
  service: ServiceContent;
};

const detailPages = new Set(["diet-plans", "fat-loss", "muscle-gain", "clinical-nutrition"]);

export function ServiceCard({ service }: ServiceCardProps): React.JSX.Element {
  const detailHref = detailPages.has(service.slug)
    ? `${PUBLIC_ROUTES.SERVICES}/${service.slug}`
    : PUBLIC_ROUTES.BOOK_CONSULTATION;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{service.title}</CardTitle>
        <CardDescription>{service.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-1 text-sm text-slate-600">
          {service.benefits.map((benefit) => (
            <li key={benefit}>- {benefit}</li>
          ))}
        </ul>
        <Button asChild variant="outline" className="w-full">
          <Link href={detailHref}>Learn More</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
