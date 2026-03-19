from datetime import timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from ...core.config import settings
from ...core.exceptions import NotFoundError
from ...core.utils import current_datetime, get_expiration_timestamp
from ..entities import RefreshToken, Tokens, User
from ..exceptions import InvitationExpiredError, UnauthorizedError, UserAlreadyExistsError
from ..repos import InvitationRepository, RefreshTokenRepository, UserRepository
from ..schemas import UserCreateForm
from ..security import create_access_token, create_refresh_token, hash_password, verify_password


def create_tokens(user: User) -> Tokens:
    """Создание пары токенов access и refresh"""

    access_token_expires_in = timedelta(minutes=settings.jwt.access_token_expires_in_minutes)
    access_token = create_access_token(
        user_id=user.id, email=user.email, user_role=user.role, username=user.username
    )
    refresh_token = create_refresh_token(user_id=user.id)
    return Tokens(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_at=get_expiration_timestamp(access_token_expires_in),
    )


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.user_repo = UserRepository(session)
        self.refresh_repo = RefreshTokenRepository(session)
        self.invitation_repo = InvitationRepository(session)

    async def register(self, token: str, form_data: UserCreateForm) -> Tokens:
        """Регистрация нового пользователя"""

        invitation = await self.invitation_repo.get_by_token(token)
        if invitation is None:
            raise NotFoundError("Invitation not found")
        if not invitation.is_valid:
            raise InvitationExpiredError("Invitation expired or already used")
        existing_user = await self.user_repo.get_by_email(invitation.email)
        if existing_user is not None:
            raise UserAlreadyExistsError(
                f"User with email - '{invitation.email}' already exists'"
            )

        user = User(
            email=invitation.email,
            username=form_data.username,
            full_name=form_data.full_name,
            role=invitation.assigned_role,
            password_hash=hash_password(form_data.password),
        )
        await self.user_repo.create(user)
        invitation.mark_as_used()
        await self.invitation_repo.upsert(invitation)

        tokens = await self._create_and_save_tokens_for_user(user)
        await self.session.commit()
        return tokens

    async def authenticate(self, email: str, password: str) -> Tokens:
        """Аутентификация пользователя по логин + пароль"""

        user = await self.user_repo.get_by_email(email)
        if user is None:
            raise UnauthorizedError(f"User not found by email - '{email}'")
        if (
                not verify_password(password, user.password_hash)
                and not user.is_active
        ):
            raise UnauthorizedError("Invalid password or user is not active")

        tokens = await self._create_and_save_tokens_for_user(user)
        await self.session.commit()
        return tokens

    async def refresh_tokens(self, refresh_token: str) -> Tokens:
        """Обновление токенов с ротацией"""

        stored_token = await self.refresh_repo.get_by_token(refresh_token)
        if stored_token is None:
            raise UnauthorizedError("Refresh token not found")
        if not stored_token.is_valid:
            raise UnauthorizedError("Refresh token is already revoked or expired")
        user = await self.user_repo.read(stored_token.user_id)
        if user is None or not user.is_active:
            await self.refresh_repo.revoke(stored_token.id)
            raise UnauthorizedError("User is not active")
        await self.refresh_repo.revoke(stored_token.id)

        new_tokens = await self._create_and_save_tokens_for_user(user)
        await self.session.commit()
        return new_tokens

    async def _create_and_save_tokens_for_user(self, user: User) -> Tokens:
        """Выпуск пары токенов + сохранение refresh токена для возможности ротации"""

        tokens = create_tokens(user)
        expires_at = current_datetime() + timedelta(settings.jwt.refresh_token_expires_in_days)
        refresh_record = RefreshToken(
            user_id=user.id,
            token=tokens.refresh_token,
            expires_at=expires_at,
        )
        await self.refresh_repo.create(refresh_record)
        return tokens
