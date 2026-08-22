"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { ClientProfileSummary } from "@/components/client/ClientProfileSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientProfileUpdateSchema } from "@/lib/validation/profile.schema";

type ProfileFormInput = z.input<typeof clientProfileUpdateSchema>;
type ProfileFormOutput = z.output<typeof clientProfileUpdateSchema>;

type ProfilePayload = {
  success: boolean;
  data?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
    };
    clientProfile: Record<string, unknown> | null;
    assignedDietician?: { firstName: string; lastName: string } | null;
    profileCompletionPercent?: number;
  };
  error?: { message: string };
};

const numericFields = [
  "height",
  "weight",
  "bmi",
  "waistInch",
  "hipInch",
  "fatPercentage",
  "visceralFat",
] as const;

type ClientProfileFormProps = {
  fetchUrl: string;
  patchUrl: string;
  title?: string;
};

export function ClientProfileForm({
  fetchUrl,
  patchUrl,
  title = "Client Profile",
}: ClientProfileFormProps): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [assignedDieticianName, setAssignedDieticianName] = useState<string | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const form = useForm<ProfileFormInput, unknown, ProfileFormOutput>({
    resolver: zodResolver(clientProfileUpdateSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      setError("");

      const response = await fetch(fetchUrl, { cache: "no-store" });
      const payload = (await response.json()) as ProfilePayload;
      if (!response.ok || !payload.success || !payload.data) {
        setError(payload.error?.message ?? "Unable to fetch profile.");
        setLoading(false);
        return;
      }

      const { user, clientProfile } = payload.data;
      const profile = clientProfile ?? {};
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? "",
        gender: (profile.gender as string | null | undefined) ?? "",
        maritalStatus: (profile.maritalStatus as string | null | undefined) ?? "",
        bloodGroup: (profile.bloodGroup as string | null | undefined) ?? "",
        primaryContact: (profile.primaryContact as string | null | undefined) ?? "",
        alternateContact: (profile.alternateContact as string | null | undefined) ?? "",
        profession: (profile.profession as string | null | undefined) ?? "",
        primaryGoal: (profile.primaryGoal as string | null | undefined) ?? "",
        otherGoal: (profile.otherGoal as string | null | undefined) ?? "",
        activityState: (profile.activityState as string | null | undefined) ?? "",
        intensity: (profile.intensity as string | null | undefined) ?? "",
        clientMedicalCondition: (profile.clientMedicalCondition as string | null | undefined) ?? "",
        clientMedicalSymptoms: (profile.clientMedicalSymptoms as string | null | undefined) ?? "",
        remarks: (profile.remarks as string | null | undefined) ?? "",
        dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : "",
        ...Object.fromEntries(
          numericFields.map((field) => [field, profile[field] !== null && profile[field] !== undefined ? String(profile[field]) : ""]),
        ),
      });

      setAssignedDieticianName(
        payload.data.assignedDietician ? `${payload.data.assignedDietician.firstName} ${payload.data.assignedDietician.lastName}` : null,
      );
      setProfileCompletion(payload.data.profileCompletionPercent ?? Number(profile.profileCompletionPercent ?? 0));
      setUpdatedAt((profile.updatedAt as string | null | undefined) ?? null);
      setLoading(false);
    };

    void load();
  }, [fetchUrl, form]);

  const profileSections = useMemo(
    () => [
      {
        title: "Personal Information",
        fields: [
          { name: "firstName", label: "First Name" },
          { name: "lastName", label: "Last Name" },
          { name: "phone", label: "Phone" },
          { name: "primaryContact", label: "Primary Contact" },
          { name: "alternateContact", label: "Alternate Contact" },
          { name: "gender", label: "Gender" },
          { name: "maritalStatus", label: "Marital Status" },
          { name: "bloodGroup", label: "Blood Group" },
          { name: "profession", label: "Profession" },
          { name: "dateOfBirth", label: "Date Of Birth", type: "date" },
        ],
      },
      {
        title: "Basic Information",
        fields: [
          { name: "height", label: "Height" },
          { name: "weight", label: "Weight" },
          { name: "bmi", label: "BMI" },
          { name: "waistInch", label: "Waist (inch)" },
          { name: "hipInch", label: "Hip (inch)" },
        ],
      },
      {
        title: "Body Information",
        fields: [
          { name: "fatPercentage", label: "Fat Percentage" },
          { name: "visceralFat", label: "Visceral Fat" },
        ],
      },
      {
        title: "Medical Information",
        fields: [
          { name: "primaryGoal", label: "Primary Goal" },
          { name: "otherGoal", label: "Other Goal" },
          { name: "clientMedicalCondition", label: "Medical Condition" },
          { name: "clientMedicalSymptoms", label: "Medical Symptoms" },
        ],
      },
      {
        title: "Other Information",
        fields: [
          { name: "activityState", label: "Activity State" },
          { name: "intensity", label: "Intensity" },
          { name: "remarks", label: "Remarks" },
        ],
      },
    ],
    [],
  );

  const onSubmit = async (values: ProfileFormOutput): Promise<void> => {
    setError("");
    setSuccess("");

    const response = await fetch(patchUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as ProfilePayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to update profile.");
      return;
    }

    setSuccess("Profile updated successfully.");
    const profile = payload.data.clientProfile ?? {};
    setProfileCompletion(Number(profile.profileCompletionPercent ?? 0));
    setUpdatedAt((profile.updatedAt as string | null | undefined) ?? null);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !form.getValues("firstName")) {
    return <EmptyState title="Unable to load profile" description={error} />;
  }

  return (
    <div className="space-y-4">
      <ClientProfileSummary
        profileCompletionPercent={profileCompletion}
        assignedDieticianName={assignedDieticianName}
        updatedAt={updatedAt}
      />
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {profileSections.map((section) => (
          <div key={section.title} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">{section.title}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input id={field.name} type={field.type ?? "text"} {...form.register(field.name as keyof ProfileFormInput)} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
