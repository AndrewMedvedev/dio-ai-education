import logging

from src.core.config import settings
from src.core.db import session_factory
from src.iam.entities import User, UserRole
from src.iam.repos import UserRepository
from src.iam.security import hash_password

logger = logging.getLogger(__name__)


async def create_first_admin() -> None:
    """Создание системного администратора"""

    async with session_factory() as session:
        user_repo = UserRepository(session)
        exists = await user_repo.get_by_email(settings.admin.email)
        if exists:
            logger.warning("Admin already exists")
            return
        admin = User(
            email=settings.admin.email,
            username="admin",
            full_name="Иванов Иван Иванович",
            role=UserRole.ADMIN,
            password_hash=hash_password(settings.admin.password),
            is_active=True,
        )
        await user_repo.create(admin)
        await session.commit()
        logger.info("First admin created successfully")
