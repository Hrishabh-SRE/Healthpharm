"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createAssignmentSchema } from "@/lib/validation/assignment.schema";
import type { AuthUser } from "@/types/auth";

type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

type AssignmentFormProps = {
  onSuccess: () => void;
};

export function AssignmentForm({ onSuccess }: AssignmentFormProps): React.JSX.Element {
  const [clients, setClients] = useState<AuthUser[]>([]);
  const [dieticians, setDieticians] = useState<AuthUser[]>([]);
  const [error, setError] = useState("");

  const form = useForm<CreateAssignmentInput>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      clientId: "",
      dieticianId: "",
    },
  });

  useEffect(() => {
    const load = async (): Promise<void> => {
      const [clientsRes, dieticiansRes] = await Promise.all([
        fetch("/api/admin/clients", { cache: "no-store" }),
        fetch("/api/admin/dieticians", { cache: "no-store" }),
      ]);

      const clientsPayload = (await clientsRes.json()) as { success: boolean; data?: { clients: AuthUser[] } };
      const dieticiansPayload = (await dieticiansRes.json()) as { success: boolean; data?: { dieticians: AuthUser[] } };
      setClients(clientsPayload.data?.clients ?? []);
      setDieticians(dieticiansPayload.data?.dieticians ?? []);
    };

    void load();
  }, []);

  const submit = async (values: CreateAssignmentInput): Promise<void> => {
    setError("");
    const response = await fetch("/api/admin/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as { success: boolean; error?: { message: string } };
    if (!response.ok || !payload.success) {
      setError(payload.error?.message ?? "Failed to create assignment.");
      return;
    }

    form.reset();
    onSuccess();
  };

  return (
    <form className="space-y-3 rounded-lg border border-slate-200 bg-white p-4" onSubmit={form.handleSubmit(submit)} noValidate>
      <h3 className="text-base font-semibold text-slate-900">Create Assignment</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="assignment-client">Client</Label>
          <select id="assignment-client" className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm" {...form.register("clientId")}>
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName} ({client.email})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="assignment-dietician">Dietician</Label>
          <select
            id="assignment-dietician"
            className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
            {...form.register("dieticianId")}
          >
            <option value="">Select dietician</option>
            {dieticians.map((dietician) => (
              <option key={dietician.id} value={dietician.id}>
                {dietician.firstName} {dietician.lastName} ({dietician.email})
              </option>
            ))}
          </select>
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Assigning..." : "Create Assignment"}
      </Button>
    </form>
  );
}
