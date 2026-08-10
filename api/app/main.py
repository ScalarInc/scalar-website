"""FastAPI application for the Scalar contact form.

Runs behind the Next.js dev/prod server, which rewrites /api/contact to this
service. Because the browser only ever talks to the Next origin there is no CORS
configuration here — and there should not be. If you find yourself needing
CORSMiddleware, the rewrite in next.config.mjs has stopped doing its job.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

import httpx
from fastapi import FastAPI

from .config import get_settings
from .ratelimit import SlidingWindowLimiter
from .routes.contact import router as contact_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()

    app.state.limiter = SlidingWindowLimiter(
        max_requests=settings.rate_limit_max,
        window_seconds=settings.rate_limit_window_s,
    )
    # One client for the process: connection reuse, and a timeout that is
    # shorter than any sane frontend fetch timeout.
    app.state.http = httpx.AsyncClient(timeout=settings.request_timeout_s)

    logger.info(
        "contact api ready — delivering to %s, auto-reply %s",
        settings.mail_to,
        "on" if settings.autoreply_active else "off",
    )
    if settings.autoreply_enabled and not settings.autoreply_active:
        logger.warning(
            "AUTOREPLY_ENABLED is set but MAIL_FROM (%s) is not a verified "
            "domain — auto-reply stays off to avoid a 403 on every submission.",
            settings.mail_from,
        )

    try:
        yield
    finally:
        await app.state.http.aclose()


app = FastAPI(
    title="Scalar contact API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
)

app.include_router(contact_router)
