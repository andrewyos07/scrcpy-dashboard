"use client";

import { useState } from "react";

export function AddDeviceForm() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmed = address.trim();
    if (!trimmed) {
      setError("Enter IP:port (e.g. 192.168.1.100:5555)");
      return;
    }

    setLoading(true);
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
      setSuccess(true);
      setAddress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Add Device
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Connect a device over network using IP:port (e.g. 192.168.1.100:5555)
        </p>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {showHelp ? "Sembunyikan panduan" : "Cara menghubungkan HP Samsung"}
        </button>
      </div>
      {showHelp && (
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              Langkah menghubungkan HP Samsung via Wi-Fi:
            </p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>
                <strong>Settings</strong> → <strong>Developer options</strong> → aktifkan{" "}
                <strong>USB debugging</strong>
              </li>
              <li>
                Aktifkan <strong>Wireless debugging</strong> (Android 11+)
              </li>
              <li>
                Cek IP: <strong>Settings</strong> → <strong>Connections</strong> →{" "}
                <strong>Wi-Fi</strong> → ketuk jaringan aktif → lihat IP address
              </li>
              <li>
                <strong>Opsi A:</strong> Hubungkan HP via USB ke Mac, buka Terminal dan jalankan:
                <code className="block p-2 ml-1 font-mono text-xs rounded bg-zinc-100 dark:bg-zinc-800">
                  adb tcpip 5555
                </code>
                Lepas USB, lalu masukkan IP:5555 di form ini.
              </li>
              <li>
                <strong>Opsi B (Wireless debugging):</strong> Di layar Wireless debugging, catat{" "}
                <strong>IP:port</strong> yang ditampilkan (port bisa berbeda, misal 41234). Masukkan
                persis seperti itu.
              </li>
              <li>Pastikan HP dan Mac terhubung ke <strong>Wi-Fi yang sama</strong>.</li>
            </ol>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <p className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-md dark:bg-green-900/20 dark:text-green-400">
            Device connected successfully.
          </p>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="192.168.1.100:5555"
            className="flex-1 px-4 py-2 bg-white rounded-md border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 font-medium text-white rounded-md transition-colors bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </div>
      </form>
    </div>
  );
}
