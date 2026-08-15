import { ServiceDetailTemplate } from "@/components/public/ServiceDetailTemplate";
import { services } from "@/content/services";

const service = services.find((item) => item.slug === "fat-loss");

export default function FatLossPage(): React.JSX.Element {
  if (!service) {
    throw new Error("Service content missing for fat-loss");
  }

  return <ServiceDetailTemplate service={service} />;
}
