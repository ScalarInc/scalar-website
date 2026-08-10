"""Contact form endpoint."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from ..config import Settings, get_settings
from ..email import EmailDeliveryError, send_autoreply, send_notification
from ..ratelimit import client_key
from ..schemas import ContactPayload, ContactResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health")
async def health(settings: Settings = Depends(get_settings)) -> dict[str, object]:
    """Liveness plus the config facts that are easy to get wrong.

    Deliberately reports whether auto-reply is actually active rather than just
    echoing the flag, since the two differ whenever the sending domain is
    unverified.
    """
    return {
        "ok": True,
        "mail_to": settings.mail_to,
        "autoreply_active": settings.autoreply_active,
    }


@router.post(
    "/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def contact(
    payload: ContactPayload,
    request: Request,
    response: Response,
    settings: Settings = Depends(get_settings),
) -> ContactResponse:
    limiter = request.app.state.limiter
    key = client_key(request, settings.trusted_proxy)

    allowed, retry_after = limiter.check(key)
    if not allowed:
        response.headers["Retry-After"] = str(retry_after)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many enquiries from this address. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )

    # Both bot checks return the ordinary success response. A 400 tells a bot
    # exactly which trap it hit and lets it adapt; a 202 teaches it nothing.
    if payload.website.strip():
        logger.info("honeypot tripped by %s — discarded", key)
        return ContactResponse()

    if payload.elapsed_ms < settings.min_submit_seconds * 1000:
        logger.info(
            "submission from %s in %dms, under the %.1fs floor — discarded",
            key,
            payload.elapsed_ms,
            settings.min_submit_seconds,
        )
        return ContactResponse()

    client = request.app.state.http

    try:
        message_id = await send_notification(client, settings, payload)
    except EmailDeliveryError as exc:
        logger.error("enquiry from %s could not be delivered: %s", payload.email, exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="We couldn't send that just now. Please try again shortly.",
        ) from exc

    logger.info("enquiry from %s delivered (resend id %s)", payload.email, message_id)

    await send_autoreply(client, settings, payload)

    return ContactResponse()
