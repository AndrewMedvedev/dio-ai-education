from enum import StrEnum

from pydantic import EmailStr, Field

from src.core.base import Entity


class UserRole(StrEnum):
    """Роли пользователя"""

    ADMIN = "admin"
    STUDENT = "student"
    TEACHER = "teacher"


class User(Entity):
    """Пользователь LMS платформы"""

    username: str | None = Field(None, title="Никнейм")
    full_name: str | None = Field(None, title="ФИО")
    email: EmailStr = Field(..., title="Email пользователя")
    role: UserRole = Field(UserRole.STUDENT, title="Роль пользователя")
    avatar_url: str | None = Field(None, description="URL адрес аватарки")
    password_hash: str = Field(..., description="Хэш пароля")
    is_active: bool = Field(True, description="Активен ли пользователь")
