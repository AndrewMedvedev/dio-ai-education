from typing import Self

import secrets
from datetime import datetime
from uuid import UUID

from pydantic import EmailStr, Field, model_validator

from ...core.base import Entity
from ...core.exceptions import InvariantViolationError
from ...core.utils import current_datetime
from .user import UserRole


def generate_invite_token(length: int = 32) -> str:
    """Генерация токена для активации приглашения"""

    return secrets.token_urlsafe(length)


class Invitation(Entity):
    """Приглашение пользователя в тикет-систему"""

    email: EmailStr = Field(..., description="Email приглашённого пользователя")
    token: str = Field(
        default_factory=generate_invite_token,
        description="Уникальный токен для ссылки-приглашения"
    )
    invited_by: UUID | None = Field(None, description="Отправитель приглашения")
    assigned_role: UserRole = Field(
        ..., description="Роль, которая назначена приглашённому пользователю"
    )
    expires_at: datetime = Field(..., description="Время истечения приглашения")
    is_used: bool = Field(False, description="Использовано ли приглашение")

    @model_validator(mode="after")
    def validate_rules(self) -> Self:
        """Проверка правил существования приглашения"""

        if self.invited_by is None and self.assigned_role == UserRole.TEACHER:
            raise InvariantViolationError("Teacher cannot invite itself")
        return self

    @property
    def is_valid(self) -> bool:
        """Актуально ли приглашение"""

        return not self.is_used and self.expires_at > current_datetime()

    def mark_as_used(self) -> None:
        """Пометить, как использованное"""

        self.is_used = True
