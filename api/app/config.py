"""Service configuration.

Settings come from the repo-root `.env` (where RESEND_API_KEY already lives) so
there is a single source of truth for secrets. Real environment variables still
win over the file, which is what production wants.
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# api/app/config.py -> api/app -> api -> repo root
REPO_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(REPO_ROOT / ".env", REPO_ROOT / "api" / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    resend_api_key: str

    # Resend authenticates senders by DNS, so `mail_from` must be an address at a
    # domain verified in the Resend dashboard. Until one is verified the only
    # usable sender is onboarding@resend.dev, which can *only* deliver to the
    # address that owns the Resend account.
    mail_from: str = "Scalar <onboarding@resend.dev>"
    mail_to: str = "info@scalar-ai.co"

    # Confirmation email to whoever submitted the form. Requires a verified
    # domain: onboarding@resend.dev cannot deliver to arbitrary recipients.
    autoreply_enabled: bool = False

    # Set when something upstream (the Next rewrite, nginx, a platform router)
    # terminates the connection, so X-Forwarded-For can be believed. See
    # ratelimit.client_key for why this matters.
    trusted_proxy: bool = True

    rate_limit_max: int = 5
    rate_limit_window_s: int = 900

    # A human filling in this form cannot do it in under a couple of seconds.
    min_submit_seconds: float = 2.5

    request_timeout_s: float = 10.0

    @property
    def autoreply_active(self) -> bool:
        """Auto-reply is only possible from a verified domain.

        Guarding on the sender as well as the flag means a half-finished config
        (flag on, domain not yet verified) degrades to "no auto-reply" instead of
        a 403 on every submission.
        """
        return self.autoreply_enabled and not self.mail_from.rstrip(" >").endswith(
            "@resend.dev"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
