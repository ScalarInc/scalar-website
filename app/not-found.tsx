import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grain flex min-h-screen flex-col items-center justify-center bg-ink-950 px-6 text-center text-paper">
      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-ink-400">
        404 — Page Not Found
      </span>
      <h1 className="display mt-4 text-[clamp(32px,5vw,64px)]">
        Lost in space.
      </h1>
      <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-ink-300">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-ink-700 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper"
      >
        Return Home
      </Link>
    </main>
  );
}
