import { NextRequest, NextResponse } from "next/server";
import { disconnectDevice } from "@/lib/adb";
import type { ApiResponse } from "@/types/device";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body as { address?: string };

    if (!address || typeof address !== "string") {
      const response: ApiResponse<never> = {
        success: false,
        error: "Address (IP:port or serial) is required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    await disconnectDevice(address.trim());

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: `Disconnected ${address}` },
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to disconnect device",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
