import { exec } from "child_process";
import { promisify } from "util";
import type { Device } from "@/types/device";

const execAsync = promisify(exec);

// Ensure ADB is found: include Homebrew paths (macOS) when running from Node/Next.js
const ADB_ENV = {
  ...process.env,
  PATH: [
    "/opt/homebrew/bin",
    "/usr/local/bin",
    process.env.PATH ?? "",
  ].join(":"),
};

export async function getDevices(): Promise<Device[]> {
  try {
    const { stdout } = await execAsync("adb devices -l", { env: ADB_ENV });
    const lines = stdout.trim().split("\n").slice(1);
    const devices: Device[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(/\s+/);
      const serial = parts[0];
      const state = parts[1] || "unknown";

      const device: Device = { serial, state };
      for (let i = 2; i < parts.length; i++) {
        const [key, value] = parts[i].split(":");
        if (key && value) {
          if (key === "product") device.product = value;
          else if (key === "model") device.model = value;
          else if (key === "device") device.device = value;
          else if (key === "transport_id") device.transportId = value;
        }
      }
      devices.push(device);
    }

    return devices;
  } catch (error) {
    throw new Error(
      `Failed to get devices: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function connectDevice(address: string): Promise<void> {
  try {
    const { stdout, stderr } = await execAsync(`adb connect ${address}`, {
      env: ADB_ENV,
      timeout: 15000,
    });
    const output = (stdout + stderr).trim();

    if (output.includes("failed to connect") || output.includes("unable to connect")) {
      throw new Error(output || "Connection failed");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message.includes("connect") ? message : `Failed to connect: ${message}`);
  }
}

export async function enableTcpipForDevice(serial: string, port = 5555): Promise<void> {
  const trimmedSerial = serial.trim();
  if (!/^[A-Za-z0-9._:-]+$/.test(trimmedSerial)) {
    throw new Error("Invalid device serial");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Invalid TCP/IP port");
  }

  try {
    const { stdout, stderr } = await execAsync(`adb -s ${trimmedSerial} tcpip ${port}`, {
      env: ADB_ENV,
      timeout: 15000,
    });
    const output = (stdout + stderr).trim().toLowerCase();

    if (output.includes("error") || output.includes("failed")) {
      throw new Error(output || "Failed to enable TCP/IP mode");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      message.includes("tcpip") ? message : `Failed to enable TCP/IP mode: ${message}`
    );
  }
}

export async function disconnectDevice(address: string): Promise<void> {
  try {
    await execAsync(`adb disconnect ${address}`, { env: ADB_ENV });
  } catch (error) {
    throw new Error(
      `Failed to disconnect: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
