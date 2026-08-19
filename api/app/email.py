"""Resend delivery.

Calls the REST API directly rather than pulling in the `resend` SDK: this is one
POST, and going direct keeps the shared async client, the timeout and the
idempotency header under our own control.
"""

import hashlib
import html
import logging
import time

import httpx

from .config import Settings
from .schemas import ContactPayload

logger = logging.getLogger(__name__)

RESEND_ENDPOINT = "https://api.resend.com/emails"


class EmailDeliveryError(RuntimeError):
    """Resend rejected the send or was unreachable."""


def _idempotency_key(payload: ContactPayload) -> str:
    """Stable for identical content within the same minute.

    Absorbs double-clicks and proxy retries without blocking a genuine second
    enquiry sent later.
    """
    bucket = int(time.time() // 60)
    raw = f"{bucket}|{payload.email}|{payload.topic}|{payload.message}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:48]


def _notification_bodies(payload: ContactPayload) -> tuple[str, str]:
    org = payload.org or "—"
    text = (
        f"New enquiry from the Scalar site\n"
        f"{'-' * 34}\n\n"
        f"Name:         {payload.name}\n"
        f"Email:        {payload.email}\n"
        f"Organisation: {org}\n"
        f"Topic:        {payload.topic}\n\n"
        f"Message\n"
        f"{'-' * 34}\n"
        f"{payload.message}\n\n"
        f"Reply directly to this email to answer {payload.name}.\n"
    )

    e = html.escape
    rows = "".join(
        f'<tr><td style="padding:4px 16px 4px 0;color:#767676;'
        f'font:500 12px ui-monospace,monospace;text-transform:uppercase;'
        f'letter-spacing:.08em;vertical-align:top">{label}</td>'
        f'<td style="padding:4px 0;color:#111;font:15px system-ui">{value}</td></tr>'
        for label, value in (
            ("Name", e(payload.name)),
            ("Email", f'<a href="mailto:{e(payload.email)}">{e(payload.email)}</a>'),
            ("Organisation", e(org)),
            ("Topic", e(payload.topic)),
        )
    )
    body_html = (
        '<div style="max-width:640px;margin:0 auto;padding:32px 24px;'
        'font:15px/1.6 system-ui,-apple-system,sans-serif;color:#111">'
        '<p style="margin:0 0 24px;font:500 11px ui-monospace,monospace;'
        'text-transform:uppercase;letter-spacing:.14em;color:#767676">'
        "New enquiry — scalar</p>"
        f'<table style="border-collapse:collapse;margin-bottom:28px">{rows}</table>'
        '<div style="border-top:1px solid #e4e4e4;padding-top:20px">'
        '<p style="margin:0 0 8px;font:500 11px ui-monospace,monospace;'
        'text-transform:uppercase;letter-spacing:.14em;color:#767676">Message</p>'
        f'<p style="margin:0;white-space:pre-wrap">{e(payload.message)}</p></div>'
        '<p style="margin:28px 0 0;color:#767676;font-size:13px">'
        f"Reply directly to this email to answer {e(payload.name)}.</p></div>"
    )
    return text, body_html


def _autoreply_bodies(payload: ContactPayload) -> tuple[str, str]:
    first = payload.name.split()[0] if payload.name.split() else "there"
    text = (
        f"Hi {first},\n\n"
        f"Thanks for getting in touch with Scalar. Your message reached us and "
        f"someone will read it properly and come back to you shortly.\n\n"
        f"For reference, here's what you sent:\n\n"
        f"{payload.message}\n\n"
        f"— Scalar\nBuilt for what's next.\n"
    )
    e = html.escape
    body_html = (
        '<div style="max-width:560px;margin:0 auto;padding:32px 24px;'
        'font:15px/1.7 system-ui,-apple-system,sans-serif;color:#111">'
        f"<p style=\"margin:0 0 16px\">Hi {e(first)},</p>"
        '<p style="margin:0 0 16px">Thanks for getting in touch with Scalar. Your '
        "message reached us and someone will read it properly and come back to "
        "you shortly.</p>"
        '<p style="margin:0 0 8px;color:#767676;font-size:13px">'
        "For reference, here's what you sent:</p>"
        '<blockquote style="margin:0 0 24px;padding:12px 16px;border-left:2px solid '
        f'#e4e4e4;color:#444;white-space:pre-wrap">{e(payload.message)}</blockquote>'
        '<p style="margin:0;color:#767676;font-size:13px">— Scalar<br>'
        "Built for what's next.</p></div>"
    )
    return text, body_html


async def _send(
    client: httpx.AsyncClient,
    settings: Settings,
    *,
    to: str,
    subject: str,
    text: str,
    body_html: str,
    reply_to: str | None = None,
    idempotency_key: str | None = None,
) -> str:
    body: dict[str, object] = {
        "from": settings.mail_from,
        "to": [to],
        "subject": subject,
        "text": text,
        "html": body_html,
    }
    if reply_to:
        # Snake case: this is the REST field name. The JS SDK's `replyTo` is a
        # client-side convenience and is not what the API accepts.
        body["reply_to"] = [reply_to]

    headers = {"Authorization": f"Bearer {settings.resend_api_key}"}
    if idempotency_key:
        headers["Idempotency-Key"] = idempotency_key

    try:
        response = await client.post(RESEND_ENDPOINT, json=body, headers=headers)
    except httpx.RequestError as exc:
        raise EmailDeliveryError(f"could not reach Resend: {exc}") from exc

    if response.status_code >= 400:
        # Logged, never returned — the response body can echo configuration
        # details, and the client has no use for them.
        raise EmailDeliveryError(
            f"Resend returned {response.status_code}: {response.text[:500]}"
        )

    return str(response.json().get("id", ""))


async def send_notification(
    client: httpx.AsyncClient, settings: Settings, payload: ContactPayload
) -> str:
    """Deliver the enquiry. Raises EmailDeliveryError if it does not land."""
    text, body_html = _notification_bodies(payload)
    return await _send(
        client,
        settings,
        to=settings.mail_to,
        subject=f"New enquiry — {payload.topic} — {payload.name}",
        text=text,
        body_html=body_html,
        # Makes Reply in the mail client address the enquirer directly. This is
        # what stands in for the auto-reply while the sending domain is
        # unverified.
        reply_to=payload.email,
        idempotency_key=_idempotency_key(payload),
    )


async def send_autoreply(
    client: httpx.AsyncClient, settings: Settings, payload: ContactPayload
) -> None:
    """Confirmation to the enquirer. Best-effort: never fails the request.

    The enquiry itself has already been delivered by the time this runs, so a
    failure here is a missing courtesy, not a lost lead.
    """
    if not settings.autoreply_active:
        return

    text, body_html = _autoreply_bodies(payload)
    try:
        await _send(
            client,
            settings,
            to=payload.email,
            subject="We got your message — Scalar",
            text=text,
            body_html=body_html,
            reply_to=settings.mail_to,
            idempotency_key=f"ar-{_idempotency_key(payload)}"[:48],
        )
    except EmailDeliveryError as exc:
        logger.warning("auto-reply to %s failed: %s", payload.email, exc)
