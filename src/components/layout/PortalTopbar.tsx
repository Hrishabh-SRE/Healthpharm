"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AuthUser } from "@/types/auth";
import { Button } from "@/components/ui/button";

type PortalTopbarProps = {
  user: AuthUser;
};

export function PortalTopbar({ user }: PortalTopbarProps): React.JSX.Element {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
        <p className="text-sm font-medium text-slate-900">
          {user.name} ({user.role})
        </p>
      </div>
      <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </header>
  );
}
