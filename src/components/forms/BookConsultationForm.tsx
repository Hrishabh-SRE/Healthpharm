"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { leadSchema } from "@/lib/validation/lead.schema";
import type { LeadInput } from "@/types/lead";

export function BookConsultationForm(): React.JSX.Element {
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      interestedService: "",
      healthGoal: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (values: LeadInput): Promise<void> => {
    setSuccessMessage("");
    setServerError("");

    const response = await fetch("/api/public/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { success: boolean };
    if (!response.ok || !payload.success) {
      setServerError("Unable to submit your request at the moment. Please try again.");
      return;
    }

    form.reset();
    setSuccessMessage("Thank you. Your consultation request has been submitted. Our team will contact you soon.");
  };

  return (
    <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" {...form.register("fullName")} />
        {form.formState.errors.fullName ? (
          <p className="text-sm text-red-600">{form.formState.errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
          {form.formState.errors.email ? <p className="text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...form.register("phone")} />
          {form.formState.errors.phone ? <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interestedService">Interested Service</Label>
        <Input id="interestedService" {...form.register("interestedService")} />
        {form.formState.errors.interestedService ? (
          <p className="text-sm text-red-600">{form.formState.errors.interestedService.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="healthGoal">Health Goal</Label>
        <Textarea id="healthGoal" {...form.register("healthGoal")} />
        {form.formState.errors.healthGoal ? (
          <p className="text-sm text-red-600">{form.formState.errors.healthGoal.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="preferredDate">Preferred Date</Label>
          <Input id="preferredDate" type="date" {...form.register("preferredDate")} />
          {form.formState.errors.preferredDate ? (
            <p className="text-sm text-red-600">{form.formState.errors.preferredDate.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredTime">Preferred Time</Label>
          <Input id="preferredTime" type="time" {...form.register("preferredTime")} />
          {form.formState.errors.preferredTime ? (
            <p className="text-sm text-red-600">{form.formState.errors.preferredTime.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-sm text-red-600">{form.formState.errors.message.message}</p>
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={form.watch("consent")}
          onCheckedChange={(checked) => form.setValue("consent", checked === true, { shouldValidate: true })}
        />
        <div>
          <Label htmlFor="consent">I consent to being contacted by the healthcare team regarding my enquiry.</Label>
          {form.formState.errors.consent ? (
            <p className="text-sm text-red-600">{form.formState.errors.consent.message}</p>
          ) : null}
        </div>
      </div>

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
      {successMessage ? <p className="text-sm font-medium text-emerald-700">{successMessage}</p> : null}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting..." : "Submit Consultation Request"}
      </Button>
    </form>
  );
}
