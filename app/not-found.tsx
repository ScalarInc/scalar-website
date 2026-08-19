import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="grain flex min-h-[80vh] flex-col items-center justify-center bg-ink-950 px-6 py-24 text-center text-paper">
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
    </div>
  );
}
