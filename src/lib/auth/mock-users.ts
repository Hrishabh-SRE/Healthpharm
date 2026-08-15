import { hashSync } from "bcryptjs";

import { ROLES } from "@/lib/auth/roles";
import type { AuthUser } from "@/types/auth";

type MockUserRecord = AuthUser & {
  passwordHash: string;
};

const defaultPasswordHash = hashSync("password123", 10);

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "u-admin-001",
    name: "Platform Admin",
    email: "admin@example.com",
    passwordHash: defaultPasswordHash,
    role: ROLES.ADMIN,
  },
  {
    id: "u-dietician-001",
    name: "Dietician User",
    email: "dietician@example.com",
    passwordHash: defaultPasswordHash,
    role: ROLES.DIETICIAN,
  },
  {
    id: "u-client-001",
    name: "Client User",
    email: "client@example.com",
    passwordHash: defaultPasswordHash,
    role: ROLES.CLIENT,
  },
];
