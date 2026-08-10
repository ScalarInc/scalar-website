"""Request and response models for the contact endpoint.

Every limit here is enforced server-side. The browser applies its own `required`
and `maxlength` attributes, but those are a convenience for humans, not a
control — anything can POST to this endpoint directly.
"""

from typing import Annotated, Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

# Must stay in sync with TOPICS in components/Contact.tsx. A value outside this
# set is a 422 rather than something silently forwarded into an email.
Topic = Literal[
    "A new product",
    "An existing system that's struggling",
    "Applied AI / machine learning",
    "Security or compliance",
    "Joining Scalar",
]


def _single_line(value: str) -> str:
    """Collapse anything that could break out of a header into a space.

    `name` and `org` are interpolated into the email subject. Control characters
    there are how header injection starts, so they never survive validation.
    """
    cleaned = "".join(" " if ch < " " or ch == "\x7f" else ch for ch in value)
    return " ".join(cleaned.split())


class ContactPayload(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100)]
    email: EmailStr
    org: Annotated[str, Field(max_length=120)] = ""
    topic: Topic
    message: Annotated[str, Field(min_length=10, max_length=5000)]

    # Honeypot: a real form leaves this empty because the field is hidden.
    website: Annotated[str, Field(max_length=200)] = ""

    # Milliseconds between the form mounting and the user pressing submit.
    elapsed_ms: Annotated[int, Field(ge=0)] = 0

    @field_validator("name", "org", mode="after")
    @classmethod
    def _clean_header_fields(cls, value: str) -> str:
        return _single_line(value)

    @field_validator("message", mode="after")
    @classmethod
    def _clean_message(cls, value: str) -> str:
        stripped = value.strip()
        if len(stripped) < 10:
            raise ValueError("message must be at least 10 characters")
        return stripped

    @field_validator("name", mode="after")
    @classmethod
    def _name_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("name must not be blank")
        return value.strip()


class ContactResponse(BaseModel):
    ok: bool = True
    message: str = "Thanks — your enquiry is with us."
