from typing import Any

from datetime import timedelta
from uuid import UUID, uuid4

import jwt
from passlib.context import CryptContext

from ..core.config import settings
from ..core.utils import current_datetime
from .entities import UserRole
from .exceptions import UnauthorizedError

# Хеширование паролей
MEMORY_COST = 100  # Размер выделяемой памяти в MB
TIME_COST = 2
PARALLELISM = 2
SALT_SIZE = 16
ROUNDS = 14  # Количество раундов для хеширования

pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    default="argon2",
    argon2__memory_cost=MEMORY_COST,
    argon2__time_cost=TIME_COST,
    argon2__parallelism=PARALLELISM,
    argon2__salt_size=SALT_SIZE,
    bcrypt__rounds=ROUNDS,
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """Создание хеша для пароля"""

    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Сверяет ожидаемый пароль с хэшем пароля"""

    return pwd_context.verify(plain_password, password_hash)


def validate_token(token: str) -> dict[str, Any]:
    """Валидация и декодирование токена"""

    try:
        return jwt.decode(
            token,
            key=settings.secret_key,
            algorithms=[settings.jwt.algorithm],
            options={"verify_aud": False}
        )
    except jwt.ExpiredSignatureError:
        raise UnauthorizedError("Token signature expired!") from None
    except jwt.PyJWTError:
        raise UnauthorizedError("Invalid token!") from None


def create_access_token(
        user_id: UUID,
        email: str,
        user_role: UserRole,
        username: str | None = None
) -> str:
    """Создание access токена"""

    now = current_datetime()
    expires_at = now + timedelta(minutes=settings.jwt.access_token_expires_in_minutes)
    payload = {
        "sub": f"{user_id}",
        "email": email,
        "role": user_role.value,
        "username": username,
        "exp": expires_at.timestamp(),
        "iat": now.timestamp(),
        "type": "access",
        "jti": str(uuid4()),
    }
    return jwt.encode(
        payload=payload, key=settings.secret_key, algorithm=settings.jwt.algorithm
    )


def create_refresh_token(user_id: UUID) -> str:
    """Создание refresh токена"""

    now = current_datetime()
    expires_at = now + timedelta(days=settings.jwt.refresh_token_expires_in_days)
    payload = {
        "sub": f"{user_id}",
        "exp": expires_at.timestamp(),
        "iat": now.timestamp(),
        "type": "refresh",
        "jti": str(uuid4()),
    }
    return jwt.encode(
        payload=payload, key=settings.secret_key, algorithm=settings.jwt.algorithm
    )
