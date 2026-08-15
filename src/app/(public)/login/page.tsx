import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, getDashboardRouteForRole } from "@/lib/auth/auth";

export default async function LoginPage(): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  if (user) {
    redirect(getDashboardRouteForRole(user.role));
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to access your role-based dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
