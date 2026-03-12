"use client";

import { useState, useEffect } from "react";
import type { RemoteServer } from "@/types/remote-server";

const STORAGE_KEY = "scrcpy-remote-servers";

function loadServers(): RemoteServer[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveServers(servers: RemoteServer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
}

function normalizeUrl(url: string): string {
  let u = url.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) {
    u = `http://${u}`;
  }
  try {
    const parsed = new URL(u);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return u;
  }
}

export function RemoteServers() {
  const [servers, setServers] = useState<RemoteServer[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setServers(loadServers());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedUrl = url.trim();
    const trimmedName = name.trim();
    if (!trimmedUrl) {
      setError("Masukkan URL server (misal: 192.168.0.50:8000)");
      return;
    }
    const normalized = normalizeUrl(trimmedUrl);
    const newServer: RemoteServer = {
      id: crypto.randomUUID(),
      name: trimmedName || normalized,
      url: normalized,
      createdAt: Date.now(),
    };
    const updated = [...loadServers(), newServer];
    saveServers(updated);
    setServers(updated);
    setName("");
    setUrl("");
  };

  const handleRemove = (id: string) => {
    const updated = servers.filter((s) => s.id !== id);
    saveServers(updated);
    setServers(updated);
  };

  const handleOpenInApp = (server: RemoteServer) => {
    window.location.href = `/remote?url=${encodeURIComponent(server.url)}`;
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Remote Servers (Laptop Lain)
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Tambah ws-scrcpy yang berjalan di laptop lain untuk mengontrol Android yang terhubung ke
          laptop tersebut.
        </p>
      </div>
      <form onSubmit={handleAdd} className="border-b border-zinc-200 p-6 dark:border-zinc-800">
        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama (opsional)"
            className="w-40 rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://192.168.0.50:8000"
            className="flex-1 min-w-[200px] rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Tambah
          </button>
        </div>
      </form>
      <div className="p-6">
        {servers.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            Belum ada remote server. Tambah URL ws-scrcpy dari laptop lain di atas.
          </p>
        ) : (
          <ul className="space-y-3">
            {servers.map((server) => (
              <li
                key={server.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                    {server.name}
                  </p>
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{server.url}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInApp(server)}
                    className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Buka
                  </button>
                  <a
                    href={server.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Tab Baru
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemove(server.id)}
                    className="inline-flex items-center rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
