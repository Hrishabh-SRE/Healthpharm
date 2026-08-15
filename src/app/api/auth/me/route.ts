import { getCurrentUser } from "@/lib/auth/auth";
import { successResponse } from "@/lib/utils/api-response";

export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  return successResponse({ user });
}
