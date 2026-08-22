"use client";

import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserForm } from "@/components/admin/UserForm";
import { UserStatusBadge } from "@/components/admin/UserStatusBadge";
import type { UserRole, UserStatus } from "@/types/auth";
import type { UserListItem } from "@/types/user";

type UserPayload = {
  success: boolean;
  data?: { users: UserListItem[] };
  error?: { message: string };
};

export function UsersTable(): React.JSX.Element {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role !== "ALL") params.set("role", role);
    if (status !== "ALL") params.set("status", status);

    const response = await fetch(`/api/admin/users?${params.toString()}`, { cache: "no-store" });
    const payload = (await response.json()) as UserPayload;
    if (!response.ok || !payload.success) {
      setError(payload.error?.message ?? "Unable to fetch users.");
      setLoading(false);
      return;
    }

    setUsers(payload.data?.users ?? []);
    setLoading(false);
  }, [q, role, status]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const updateStatus = async (userId: string, nextStatus: UserStatus): Promise<void> => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    await loadUsers();
  };

  const startEdit = (user: UserListItem): void => {
    setEditingUserId(user.id);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditPhone(user.phone ?? "");
  };

  const submitEdit = async (userId: string): Promise<void> => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone,
      }),
    });
    setEditingUserId(null);
    await loadUsers();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <UserForm onSuccess={() => void loadUsers()} />

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search name/email/phone" value={q} onChange={(event) => setQ(event.target.value)} />
          <select
            className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole | "ALL")}
          >
            <option value="ALL">All roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="DIETICIAN">DIETICIAN</option>
            <option value="CLIENT">CLIENT</option>
          </select>
          <select
            className="h-10 rounded-md border border-slate-300 px-3 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as UserStatus | "ALL")}
          >
            <option value="ALL">All status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="INVITED">INVITED</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
          <Button type="button" onClick={() => void loadUsers()}>
            Apply
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {users.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting filters or create a new user." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Last Login</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    {editingUserId === user.id ? (
                      <div className="space-y-1">
                        <Input value={editFirstName} onChange={(event) => setEditFirstName(event.target.value)} />
                        <Input value={editLastName} onChange={(event) => setEditLastName(event.target.value)} />
                      </div>
                    ) : (
                      `${user.firstName} ${user.lastName}`
                    )}
                  </td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">
                    {editingUserId === user.id ? (
                      <Input value={editPhone} onChange={(event) => setEditPhone(event.target.value)} />
                    ) : (
                      user.phone ?? "-"
                    )}
                  </td>
                  <td className="px-3 py-2">{user.role}</td>
                  <td className="px-3 py-2">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="px-3 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {editingUserId === user.id ? (
                        <Button type="button" size="sm" onClick={() => void submitEdit(user.id)}>
                          Save
                        </Button>
                      ) : (
                        <Button type="button" size="sm" variant="outline" onClick={() => startEdit(user)}>
                          Edit
                        </Button>
                      )}
                      <Button type="button" size="sm" variant="outline" onClick={() => void updateStatus(user.id, "ACTIVE")}>
                        Activate
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => void updateStatus(user.id, "INACTIVE")}>
                        Deactivate
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
