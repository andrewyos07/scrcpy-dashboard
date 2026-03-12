import Link from "next/link";

const SCRCPY_URL = process.env.NEXT_PUBLIC_SCRCPY_URL || "http://localhost:8000";

interface DevicePageProps {
  params: Promise<{ serial: string }>;
}

export default async function DevicePage({ params }: DevicePageProps) {
  const { serial } = await params;
  const decodedSerial = decodeURIComponent(serial);

  const iframeUrl = new URL(SCRCPY_URL);
  iframeUrl.searchParams.set("serial", decodedSerial);

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-zinc-500">|</span>
          <span className="truncate text-sm text-zinc-300">{decodedSerial}</span>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <iframe
          src={iframeUrl.toString()}
          title={`Scrcpy - ${decodedSerial}`}
          className="h-full w-full border-0"
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
