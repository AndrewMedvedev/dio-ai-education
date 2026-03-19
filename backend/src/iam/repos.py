from uuid import UUID

from sqlalchemy import select, update

from ..core.repo import SqlAlchemyRepository
from ..core.utils import current_datetime
from .entities import Group, Invitation, RefreshToken, User, UserRole
from .models import GroupOrm, InvitationOrm, RefreshTokenOrm, UserOrm


class UserRepository(SqlAlchemyRepository[User, UserOrm]):
    entity = User
    model = UserOrm

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(self.model).where(self.model.email == email)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else self.entity.model_validate(model)


class RefreshTokenRepository(SqlAlchemyRepository[RefreshToken, RefreshTokenOrm]):
    entity = RefreshToken
    model = RefreshTokenOrm

    async def get_by_token(self, token: str) -> RefreshToken | None:
        stmt = select(self.model).where(self.model.token == token)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else self.entity.model_validate(model)

    async def revoke(self, token_id: UUID) -> None:
        stmt = (
            update(self.model)
            .where(self.model.id == token_id)
            .values(revoked=True, revoked_at=current_datetime())
        )
        await self.session.execute(stmt)


class InvitationRepository(SqlAlchemyRepository[Invitation, InvitationOrm]):
    entity = Invitation
    model = InvitationOrm

    async def get_by_token(self, token: str) -> Invitation | None:
        stmt = select(self.model).where(self.model.token == token)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else self.entity.model_validate(model)

    async def get_active_by_email_and_role(self, email: str, role: UserRole) -> Invitation | None:
        stmt = (
            select(self.model)
            .where(
                (self.model.email == email) &
                (self.model.assigned_role == role) &
                (not self.model.is_used)
            )
            .limit(1)
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else self.entity.model_validate(model)


class GroupRepository(SqlAlchemyRepository[Group, GroupOrm]):
    entity = Group
    model = GroupOrm
