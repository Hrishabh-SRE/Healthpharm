import { ServiceDetailTemplate } from "@/components/public/ServiceDetailTemplate";
import { services } from "@/content/services";

const service = services.find((item) => item.slug === "clinical-nutrition");

export default function ClinicalNutritionPage(): React.JSX.Element {
  if (!service) {
    throw new Error("Service content missing for clinical-nutrition");
  }

  return <ServiceDetailTemplate service={service} />;
}
