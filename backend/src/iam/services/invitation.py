import logging
from datetime import timedelta
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from ...core.config import INVITATION_EXPIRES_IN_DAYS, settings
from ...core.exceptions import EmailSendingFailedError
from ...core.utils import current_datetime, send_mail
from ..entities import Invitation, UserRole
from ..repos import InvitationRepository

logger = logging.getLogger(__name__)


class InvitationService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.invitation_repo = InvitationRepository(session)

    async def invite_student(
            self, teacher_id: UUID, student_email: str, group_id: UUID | None = None
    ):
        """Отправляет приглашение для присоединения студента к группе"""

    async def invite_teacher(self, invited_by: UUID, email: str) -> Invitation:
        """Приглашает преподавателя в систему через отправку письма"""

        assigned_role = UserRole.TEACHER
        invitation = await self.invitation_repo.get_active_by_email_and_role(email, assigned_role)
        if invitation is None:
            expires_at = current_datetime() + timedelta(days=INVITATION_EXPIRES_IN_DAYS)
            invitation = Invitation(
                email=email,
                invited_by=invited_by,
                assigned_role=assigned_role,
                expires_at=expires_at,
            )
        invite_url = f"{settings.frontend_url}/auth/invite/accept?token={invitation.token}"
        context = {
            "email": invitation.email,
            "invite_url": invite_url,
            "expires_in_days": INVITATION_EXPIRES_IN_DAYS,
            "platform_name": "ТИУ AI LMS",
            "inviter_name_or_email": "Иван Иванов",
            "frontend_url": "https://example.com",
            "current_year": current_datetime().year,
        }
        try:
            await self.invitation_repo.create(invitation)
            await send_mail(
                to=invitation.email,
                subject="Приглашение в LMS платформу",
                plain_text="".format(**context),
                template_name="email/invite_teacher.html",
                context=context,
            )
            await self.session.commit()
        except EmailSendingFailedError:
            logger.exception("Email sending failed")
            await self.session.rollback()
        logger.info(
            "Invitation sent: %s -> %s (%s)", invited_by, email, assigned_role
        )
        return invitation

    async def repeat(self):
        """Повторная отправка приглашения"""
