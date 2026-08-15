import { ServiceDetailTemplate } from "@/components/public/ServiceDetailTemplate";
import { services } from "@/content/services";

const service = services.find((item) => item.slug === "diet-plans");

export default function DietPlansPage(): React.JSX.Element {
  if (!service) {
    throw new Error("Service content missing for diet-plans");
  }

  return <ServiceDetailTemplate service={service} />;
}
