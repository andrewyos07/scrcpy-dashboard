"use client";

import { useState } from "react";
import Link from "next/link";
import type { Device } from "@/types/device";

export function AddDeviceForm() {
  const [mode, setMode] = useState<"usb" | "wifi">("usb");
  const [address, setAddress] = useState("");
  const [wifiLoading, setWifiLoading] = useState(false);
  const [usbLoading, setUsbLoading] = useState(false);
  const [tcpipLoading, setTcpipLoading] = useState<string | null>(null);
  const [usbDevices, setUsbDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsbDevices = async () => {
    setUsbLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/devices");
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to fetch devices");
      }
      const devices = ((json.data ?? []) as Device[]).filter(
        (device) => device.serial && !device.serial.includes(":")
      );
      setUsbDevices(devices);
      if (devices.length === 0) {
        setSuccess("No USB device found. Plug in your phone and enable USB debugging.");
      } else {
        setSuccess(`Found ${devices.length} USB device(s).`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch USB devices");
      setUsbDevices([]);
    } finally {
      setUsbLoading(false);
    }
  };

  const handleEnableTcpip = async (serial: string) => {
    setTcpipLoading(serial);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/devices/tcpip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serial, port: 5555 }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to enable Wi-Fi mode");
      }
      setSuccess(
        `Wi-Fi mode enabled for ${serial}. Disconnect cable and connect using phone IP:5555.`
      );
      setMode("wifi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable Wi-Fi mode");
    } finally {
      setTcpipLoading(null);
    }
  };

  const handleWifiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = address.trim();
    if (!trimmed) {
      setError("Enter IP:port (e.g. 192.168.1.100:5555)");
      return;
    }

    setWifiLoading(true);
    try {
      const res = await fetch("/api/devices/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: trimmed }),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Connection failed");
      }
      setSuccess("Device connected successfully.");
      setAddress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setWifiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Add Device
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choose USB or Wi-Fi (IP:port) connection mode.
        </p>
      </div>
      <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
        <div className="inline-flex rounded-md border border-zinc-300 p-1 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setMode("usb")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "usb"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            USB
          </button>
          <button
            type="button"
            onClick={() => setMode("wifi")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "wifi"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            Wi-Fi (IP:port)
          </button>
        </div>
      </div>
      <div className="p-6">
        {error && (
          <p className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-md dark:bg-green-900/20 dark:text-green-400">
            {success}
          </p>
        )}

        {mode === "usb" ? (
          <div>
            <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
              Connect device using USB cable first, then optionally enable Wi-Fi mode.
            </p>
            <button
              type="button"
              onClick={fetchUsbDevices}
              disabled={usbLoading}
              className="mb-4 px-4 py-2 text-sm font-medium rounded-md border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {usbLoading ? "Refreshing..." : "Refresh USB Devices"}
            </button>

            {usbDevices.length > 0 && (
              <ul className="space-y-3">
                {usbDevices.map((device) => (
                  <li
                    key={device.serial}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                        {device.model || device.product || device.serial}
                      </p>
                      <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {device.serial} · {device.state}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/device/${encodeURIComponent(device.serial)}`}
                        className="inline-flex items-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleEnableTcpip(device.serial)}
                        disabled={tcpipLoading === device.serial}
                        className="inline-flex items-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        {tcpipLoading === device.serial ? "Enabling..." : "Enable Wi-Fi"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <form onSubmit={handleWifiSubmit}>
            <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
              Connect using device IP:port (for example 192.168.1.100:5555).
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="192.168.1.100:5555"
                className="flex-1 px-4 py-2 bg-white rounded-md border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                disabled={wifiLoading}
              />
              <button
                type="submit"
                disabled={wifiLoading}
                className="px-6 py-2 font-medium text-white rounded-md transition-colors bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {wifiLoading ? "Connecting..." : "Connect"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
