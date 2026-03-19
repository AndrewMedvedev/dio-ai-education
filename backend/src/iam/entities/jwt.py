from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field, PositiveInt

from src.core.base import Entity
from src.core.utils import current_datetime


class TokenType(StrEnum):
    """Типы токена"""

    ACCESS = "access"
    REFRESH = "refresh"


class Tokens(BaseModel):
    """Пара токенов 'access' и 'refresh'"""

    access_token: str = Field(..., description="Для аутентификации")
    refresh_token: str = Field(..., description="Для получения новой пары токенов")
    token_type: str = Field(default="Bearer", frozen=True)
    expires_at: PositiveInt = Field(
        ..., description="Время истечения access токена в формате timestamp"
    )


class RefreshToken(Entity):
    """Схема 'refresh' токена - для ротации"""

    user_id: UUID = Field(..., description="ID пользователя, которому выдан токен")
    token: str = Field(..., description="Refresh токен")
    expires_at: datetime = Field(..., description="Дата истечения")
    revoked: bool = Field(False, description="Отозван ли токен")
    revoked_at: datetime | None = Field(None, description="Время отзыва")

    @property
    def is_valid(self) -> bool:
        """Проверка токена на валидность"""

        return not self.revoked and self.expires_at < current_datetime()
