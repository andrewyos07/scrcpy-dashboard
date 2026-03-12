import { NextResponse } from "next/server";
import { getDevices } from "@/lib/adb";
import type { ApiResponse } from "@/types/device";

export async function GET() {
  try {
    const devices = await getDevices();
    const response: ApiResponse<typeof devices> = {
      success: true,
      data: devices,
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch devices",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
