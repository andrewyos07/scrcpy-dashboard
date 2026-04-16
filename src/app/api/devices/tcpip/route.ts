import { NextRequest, NextResponse } from "next/server";
import { enableTcpipForDevice } from "@/lib/adb";
import type { ApiResponse, EnableTcpipInput } from "@/types/device";

export async function POST(request: NextRequest) {
  try {
    const body: EnableTcpipInput = await request.json();
    const serial = body.serial?.trim();
    const port = body.port ?? 5555;

    if (!serial) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Serial is required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Port must be an integer between 1 and 65535",
      };
      return NextResponse.json(response, { status: 400 });
    }

    await enableTcpipForDevice(serial, port);

    const response: ApiResponse<{ message: string; addressHint: string }> = {
      success: true,
      data: {
        message: `TCP/IP enabled for ${serial} on port ${port}`,
        addressHint: `Use your device IP:${port} in Wi-Fi connect mode`,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to enable TCP/IP mode",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
