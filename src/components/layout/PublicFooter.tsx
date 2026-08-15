import { Container } from "@/components/shared/Container";
import { siteConfig } from "@/content/site";

export function PublicFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <Container className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-900">{siteConfig.name}</p>
          <p className="mt-2 max-w-md">
            Personalized nutrition guidance through dietician-led care, structured follow-up, and sustainable wellness support.
          </p>
        </div>
        <div className="md:justify-self-end md:text-right">
          <p>{siteConfig.contactEmail}</p>
          <p>{siteConfig.contactPhone}</p>
          <p>{siteConfig.address}</p>
        </div>
      </Container>
    </footer>
  );
}
