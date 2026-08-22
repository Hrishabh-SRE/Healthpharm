"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validation/auth.schema";
import type { LoginInput } from "@/types/auth";

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput): Promise<void> => {
    setServerError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as {
      success: boolean;
      error?: { code: string; message: string };
      data?: { redirectTo: string };
    };
    if (!response.ok || !payload.success || !payload.data?.redirectTo) {
      setServerError("Invalid email or password.");
      return;
    }

    router.push(payload.data.redirectTo);
    router.refresh();
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {serverError ? <p className="text-sm font-medium text-red-600">{serverError}</p> : null}

      <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
