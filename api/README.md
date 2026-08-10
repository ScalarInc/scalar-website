# Contact API

FastAPI service behind the marketing site's enquiry form. Validates the
submission, filters bots, and delivers it by email through Resend.

## Run

```sh
cd api
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Then `npm run dev` in the repo root. The browser posts to `/api/contact` on the
Next origin, and `next.config.mjs` rewrites that to this service — so there is no
CORS configuration here, and there should not be.

## Configuration

Read from the repo-root `.env` (an `api/.env` also works and takes precedence).
Real environment variables override both.

| variable | default | notes |
|---|---|---|
| `RESEND_API_KEY` | *required* | |
| `MAIL_FROM` | `Scalar <onboarding@resend.dev>` | must be a **verified domain** |
| `MAIL_TO` | `scalarinc.dev@gmail.com` | where enquiries land |
| `AUTOREPLY_ENABLED` | `false` | see below |
| `TRUSTED_PROXY` | `true` | read client IP from `X-Forwarded-For` |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_S` | `5` / `900` | per client IP |
| `MIN_SUBMIT_SECONDS` | `2.5` | floor on time-to-submit |

### The sending-domain constraint

Resend authenticates senders by DNS, so `MAIL_FROM` has to be an address at a
domain verified in the Resend dashboard. A Gmail address cannot be used — you
don't control `gmail.com`'s DNS.

With no verified domain the only usable sender is `onboarding@resend.dev`, and it
**can only deliver to the address that owns the Resend account**. Anything else
comes back 403. So today: notifications to `scalarinc.dev@gmail.com` work,
auto-replies to arbitrary enquirers do not.

`AUTOREPLY_ENABLED` therefore defaults to `false`, and `Settings.autoreply_active`
keeps it off whenever `MAIL_FROM` still points at `resend.dev` — a half-finished
config degrades to "no auto-reply" rather than failing every submission. In its
place the notification sets `reply_to` to the enquirer's address, so hitting Reply
answers them directly.

To turn it on: verify a domain in Resend, set `MAIL_FROM=Scalar <hello@yourdomain>`
and `AUTOREPLY_ENABLED=true`. No code change. `GET /health` reports
`autoreply_active` so you can confirm it took effect.

## Endpoints

- `GET /health` — liveness plus the two settings that are easiest to get wrong
- `POST /contact` — `202 Accepted` on success

### Bot filtering

A honeypot field and a minimum time-to-submit. Both rejections return the normal
`202` success body: a `400` would tell a bot which trap it hit and let it adapt.
Check the logs to distinguish a discarded submission from a delivered one.

Genuine validation failures (bad email, short message, unknown topic) still return
`422`, since those are real users making real mistakes.

## Rate limiting

In-memory sliding window, per client IP. Fine for one instance; with multiple
replicas each process keeps its own counters and the effective limit multiplies by
the replica count — that's the point to move the window into Redis.

The client IP comes from `X-Forwarded-For` when `TRUSTED_PROXY` is set, because
behind the rewrite the socket peer is always the Next server. Without that, five
submissions from anyone would throttle the entire site. Only enable it when a
proxy you control actually sets the header — otherwise callers can spoof it.
