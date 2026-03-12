import { NextRequest, NextResponse } from "next/server";
import { connectDevice } from "@/lib/adb";
import type { ApiResponse, AddDeviceInput } from "@/types/device";

export async function POST(request: NextRequest) {
  try {
    const body: AddDeviceInput = await request.json();
    const { address } = body;

    if (!address || typeof address !== "string") {
      const response: ApiResponse<never> = {
        success: false,
        error: "Address (IP:port) is required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    let target = address.trim();
    // If user enters only IP, append default port 5555
    if (!target.includes(":")) {
      target = `${target}:5555`;
    }

    await connectDevice(target);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: `Connected to ${target}` },
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect device",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
