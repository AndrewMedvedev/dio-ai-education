from typing import Optional

from datetime import datetime
from uuid import UUID

from sqlalchemy import TEXT, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.db import Base
from .entities import UserRole


class UserOrm(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(unique=True)
    username: Mapped[str | None] = mapped_column(nullable=True)
    full_name: Mapped[str | None] = mapped_column(nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    password_hash: Mapped[str] = mapped_column(unique=True)
    is_active: Mapped[bool]


class RefreshTokenOrm(Base):
    __tablename__ = "refresh_tokens"

    user_id: Mapped[UUID]
    token: Mapped[str] = mapped_column(unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked: Mapped[bool]
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class InvitationOrm(Base):
    __tablename__ = "invitations"

    email: Mapped[str]
    token: Mapped[str] = mapped_column(unique=True)
    invited_by: Mapped[UUID]
    assigned_role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_used: Mapped[bool]

    group: Mapped[Optional["GroupOrm"]] = relationship(back_populates="invitations")


class GroupOrm(Base):
    __tablename__ = "groups"

    title: Mapped[str]
    description: Mapped[str | None] = mapped_column(TEXT, nullable=True)
    created_by: Mapped[UUID] = mapped_column(ForeignKey("users.id"), unique=False)
    # course_id: Mapped[UUID] = mapped_column(ForeignKey("courses.id"), unique=False)
    max_students: Mapped[int | None] = mapped_column(nullable=True)
    is_private: Mapped[bool]

    invitations: Mapped[list["InvitationOrm"]] = relationship(back_populates="group")
