import Link from "next/link";

interface RemotePageProps {
  searchParams: Promise<{ url?: string }>;
}

export default async function RemotePage({ searchParams }: RemotePageProps) {
  const params = await searchParams;
  const url = params.url;

  if (!url || typeof url !== "string") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8">
        <p className="mb-4 text-zinc-400">URL tidak valid. Kembali ke dashboard.</p>
        <Link
          href="/"
          className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  let decodedUrl: string;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch {
    decodedUrl = url;
  }

  // Basic URL validation
  if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8">
        <p className="mb-4 text-zinc-400">URL harus dimulai dengan http:// atau https://</p>
        <Link
          href="/"
          className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
    );
  }

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
          <span className="truncate text-sm text-zinc-300">{decodedUrl}</span>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <iframe
          src={decodedUrl}
          title="Remote ws-scrcpy"
          className="h-full w-full border-0"
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
