import { ServiceDetailTemplate } from "@/components/public/ServiceDetailTemplate";
import { services } from "@/content/services";

const service = services.find((item) => item.slug === "muscle-gain");

export default function MuscleGainPage(): React.JSX.Element {
  if (!service) {
    throw new Error("Service content missing for muscle-gain");
  }

  return <ServiceDetailTemplate service={service} />;
}
