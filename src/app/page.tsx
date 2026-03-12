import { DeviceList } from "@/components/DeviceList";
import { AddDeviceForm } from "@/components/AddDeviceForm";
import { RemoteServers } from "@/components/RemoteServers";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Scrcpy Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="space-y-6">
          <AddDeviceForm />
          <DeviceList />
          <RemoteServers />
        </div>
      </main>
    </div>
  );
}
