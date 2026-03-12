"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Device } from "@/types/device";

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/devices");
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to fetch devices");
      }
      setDevices(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const handleDisconnect = async (address: string) => {
    setActionLoading(address);
    try {
      const res = await fetch("/api/devices/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disconnect failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Connected Devices
        </h2>
      </div>
      <div className="p-6">
        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        {devices.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            No devices connected. Add a device by IP:port above.
          </p>
        ) : (
          <ul className="space-y-3">
            {devices.map((device) => (
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
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/device/${encodeURIComponent(device.serial)}`}
                    className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Open
                  </Link>
                  {device.serial.includes(":") && (
                    <button
                      type="button"
                      onClick={() => handleDisconnect(device.serial)}
                      disabled={actionLoading === device.serial}
                      className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      {actionLoading === device.serial ? "Disconnecting..." : "Disconnect"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
