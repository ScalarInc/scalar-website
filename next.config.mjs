/** @type {import('next').NextConfig} */

// Where the FastAPI contact service lives. Literal IP rather than `localhost`:
// Node resolves `localhost` to ::1 first on Windows, and uvicorn bound to
// 0.0.0.0 is not listening on IPv6, which surfaces as a confusing ECONNREFUSED.
let rawOrigin = (process.env.API_ORIGIN || "http://127.0.0.1:8000").trim().replace(/\/+$/, "");
if (!rawOrigin.startsWith("http://") && !rawOrigin.startsWith("https://")) {
  rawOrigin = `https://${rawOrigin}`;
}
const API_ORIGIN = rawOrigin;

// Applied to every response. CSP is deliberately left out for now: Next's
// inline bootstrap scripts and the JSON-LD block need nonces or 'unsafe-inline',
// so it should be rolled out in Report-Only mode first.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig = {
  reactStrictMode: true,

  // One canonical host. www served a 200 duplicate of the whole site.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.scalar-ai.co" }],
        destination: "https://scalar-ai.co/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },

  // Proxy the form endpoint so the browser only ever talks to this origin. Keeps
  // the request same-origin (no CORS, no preflight) and keeps the backend host
  // out of the client bundle.
  async rewrites() {
    return [
      {
        source: "/api/contact",
        destination: `${API_ORIGIN}/contact`,
      },
    ];
  },
};

export default nextConfig;
