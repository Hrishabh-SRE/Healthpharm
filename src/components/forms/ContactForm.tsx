"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/validation/contact.schema";

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm(): React.JSX.Element {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitted(true);
    form.reset();
  };

  return (
    <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>

      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input id="contact-name" {...form.register("name")} />
        {form.formState.errors.name ? <p className="text-sm text-red-600">{form.formState.errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input id="contact-email" type="email" {...form.register("email")} />
        {form.formState.errors.email ? <p className="text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone">Phone</Label>
        <Input id="contact-phone" {...form.register("phone")} />
        {form.formState.errors.phone ? <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-sm text-red-600">{form.formState.errors.message.message}</p>
        ) : null}
      </div>

      {isSubmitted ? (
        <p className="text-sm font-medium text-emerald-700">Thank you. Our team will connect with you shortly.</p>
      ) : null}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending..." : "Submit"}
      </Button>
    </form>
  );
}
