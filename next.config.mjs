/** @type {import('next').NextConfig} */

// Where the FastAPI contact service lives. Literal IP rather than `localhost`:
// Node resolves `localhost` to ::1 first on Windows, and uvicorn bound to
// 0.0.0.0 is not listening on IPv6, which surfaces as a confusing ECONNREFUSED.
let rawOrigin = (process.env.API_ORIGIN || "http://127.0.0.1:8000").trim().replace(/\/+$/, "");
if (!rawOrigin.startsWith("http://") && !rawOrigin.startsWith("https://")) {
  rawOrigin = `https://${rawOrigin}`;
}
const API_ORIGIN = rawOrigin;

const nextConfig = {
  reactStrictMode: true,

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
