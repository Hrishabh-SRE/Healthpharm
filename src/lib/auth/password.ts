import { compare, hash } from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return hash(plainTextPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainTextPassword: string, passwordHash: string): Promise<boolean> {
  return compare(plainTextPassword, passwordHash);
}
