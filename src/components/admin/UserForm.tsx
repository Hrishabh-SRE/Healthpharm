"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdminUserSchema } from "@/lib/validation/admin-user.schema";

type CreateUserInput = z.infer<typeof createAdminUserSchema>;

type UserFormProps = {
  onSuccess: () => void;
};

export function UserForm({ onSuccess }: UserFormProps): React.JSX.Element {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "CLIENT",
      status: "ACTIVE",
      temporaryPassword: "",
    },
  });

  const submit = async (values: CreateUserInput): Promise<void> => {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      return;
    }

    form.reset();
    onSuccess();
  };

  return (
    <form className="space-y-3 rounded-lg border border-slate-200 bg-white p-4" onSubmit={form.handleSubmit(submit)} noValidate>
      <h3 className="text-base font-semibold text-slate-900">Create User</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="user-first-name">First Name</Label>
          <Input id="user-first-name" {...form.register("firstName")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-last-name">Last Name</Label>
          <Input id="user-last-name" {...form.register("lastName")} />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="user-email">Email</Label>
          <Input id="user-email" type="email" {...form.register("email")} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="user-phone">Phone</Label>
          <Input id="user-phone" {...form.register("phone")} />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <select className="h-10 rounded-md border border-slate-300 px-3 text-sm" {...form.register("role")}>
          <option value="CLIENT">CLIENT</option>
          <option value="DIETICIAN">DIETICIAN</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <select className="h-10 rounded-md border border-slate-300 px-3 text-sm" {...form.register("status")}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="INVITED">INVITED</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>
        <Input type="password" placeholder="Temporary password" {...form.register("temporaryPassword")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
