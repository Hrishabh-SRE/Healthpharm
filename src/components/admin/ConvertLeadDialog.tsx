"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertLeadToClientSchema } from "@/lib/validation/admin-lead.schema";

type ConvertLeadDialogProps = {
  leadId: string;
  defaultEmail: string;
  defaultPhone: string;
  defaultFullName: string;
  onSuccess: () => void;
};

type ConvertLeadInput = z.infer<typeof convertLeadToClientSchema>;

export function ConvertLeadDialog({
  leadId,
  defaultEmail,
  defaultPhone,
  defaultFullName,
  onSuccess,
}: ConvertLeadDialogProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const [firstName = "", lastName = ""] = defaultFullName.split(" ");

  const form = useForm<ConvertLeadInput>({
    resolver: zodResolver(convertLeadToClientSchema),
    defaultValues: {
      firstName,
      lastName,
      email: defaultEmail,
      phone: defaultPhone,
      temporaryPassword: "",
      primaryGoal: "",
    },
  });

  const submit = async (values: ConvertLeadInput): Promise<void> => {
    setServerError("");
    const response = await fetch(`/api/admin/leads/${leadId}/convert-to-client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as { success: boolean; error?: { message: string } };
    if (!response.ok || !payload.success) {
      setServerError(payload.error?.message ?? "Failed to convert lead.");
      return;
    }

    setIsOpen(false);
    form.reset({
      firstName,
      lastName,
      email: defaultEmail,
      phone: defaultPhone,
      temporaryPassword: "",
      primaryGoal: "",
    });
    onSuccess();
  };

  return (
    <div>
      <Button type="button" size="sm" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? "Close" : "Convert to Client"}
      </Button>
      {isOpen ? (
        <form className="mt-3 space-y-3 rounded-md border border-slate-200 p-3" onSubmit={form.handleSubmit(submit)} noValidate>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`firstName-${leadId}`}>First Name</Label>
              <Input id={`firstName-${leadId}`} {...form.register("firstName")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`lastName-${leadId}`}>Last Name</Label>
              <Input id={`lastName-${leadId}`} {...form.register("lastName")} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`email-${leadId}`}>Email</Label>
              <Input id={`email-${leadId}`} type="email" {...form.register("email")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`phone-${leadId}`}>Phone</Label>
              <Input id={`phone-${leadId}`} {...form.register("phone")} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`password-${leadId}`}>Temporary Password</Label>
            <Input id={`password-${leadId}`} type="password" {...form.register("temporaryPassword")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`goal-${leadId}`}>Primary Goal (optional)</Label>
            <Input id={`goal-${leadId}`} {...form.register("primaryGoal")} />
          </div>

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
          <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Converting..." : "Confirm Conversion"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
