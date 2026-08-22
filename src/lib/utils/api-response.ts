import { NextResponse } from "next/server";

import type { ApiErrorCode } from "@/types/common";

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(code: ApiErrorCode, message: string, status = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    { status },
  );
}
