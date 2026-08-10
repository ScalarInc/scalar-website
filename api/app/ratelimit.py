"""In-memory sliding-window rate limiter.

Appropriate for a single-instance marketing form. If this service is ever run
with more than one replica each process keeps its own counters, and the limit
effectively multiplies by the replica count — that is the point to move the
window into Redis.
"""

import time
from collections import deque

from fastapi import Request

# Stop a distributed flood from growing the dict without bound. Once past this
# many tracked keys, the oldest idle entries are dropped.
_MAX_TRACKED_KEYS = 10_000


class SlidingWindowLimiter:
    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self._max = max_requests
        self._window = window_seconds
        self._hits: dict[str, deque[float]] = {}

    def _prune(self, key: str, now: float) -> deque[float]:
        window = self._hits.setdefault(key, deque())
        cutoff = now - self._window
        while window and window[0] <= cutoff:
            window.popleft()
        return window

    def _evict_idle(self, now: float) -> None:
        if len(self._hits) <= _MAX_TRACKED_KEYS:
            return
        cutoff = now - self._window
        stale = [k for k, w in self._hits.items() if not w or w[-1] <= cutoff]
        for key in stale:
            del self._hits[key]

    def check(self, key: str) -> tuple[bool, int]:
        """Record a hit. Returns (allowed, retry_after_seconds)."""
        now = time.monotonic()
        self._evict_idle(now)
        window = self._prune(key, now)

        if len(window) >= self._max:
            retry_after = int(self._window - (now - window[0])) + 1
            return False, max(retry_after, 1)

        window.append(now)
        return True, 0


def client_key(request: Request, trusted_proxy: bool) -> str:
    """Identify the caller for rate-limiting purposes.

    Behind the Next.js rewrite the socket peer is always the Next server, so
    `request.client.host` would collapse every visitor onto one key and let five
    submissions throttle the whole site. When a proxy is in front we therefore
    read the originating address from X-Forwarded-For instead.

    X-Forwarded-For is trivially spoofable when it is *not* set by a proxy we
    control, which is exactly why this is opt-in via `trusted_proxy`.
    """
    if trusted_proxy:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            first = forwarded.split(",")[0].strip()
            if first:
                return first
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip.strip()

    return request.client.host if request.client else "unknown"
