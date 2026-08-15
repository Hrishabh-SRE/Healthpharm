import { BookConsultationForm } from "@/components/forms/BookConsultationForm";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";

export default function BookConsultationPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Book Consultation"
        description="Share your details and health goals. Our team will reach out to help you get started."
      />
      <Section>
        <Container className="max-w-3xl">
          <BookConsultationForm />
        </Container>
      </Section>
    </>
  );
}
