import asyncio
import logging
import os

from dotenv import load_dotenv
from pydantic import SecretStr

from src.core.entities.user import Teacher, UserRole
from src.infra.db.conn import session_factory
from src.infra.db.repos import UserRepository
from src.settings import ENV_PATH
from src.utils.secutiry import get_password_hash

logger = logging.getLogger(__name__)

load_dotenv(ENV_PATH)

TEACHER_ID = os.getenv("TEACHER_ID")
TEACHER_USERNAME = os.getenv("TEACHER_USERNAME")
TEACHER_PASSWORD = os.getenv("TEACHER_PASSWORD")


async def main() -> None:
    password_hash = get_password_hash(TEACHER_PASSWORD)
    teacher = Teacher(
        id=TEACHER_ID,
        username=TEACHER_USERNAME,
        password_hash=SecretStr(password_hash),
    )
    async with session_factory() as session:
        user_repo = UserRepository(session)
        exists_user = await user_repo.read(teacher.id)
        if exists_user is None:
            logger.info("Teacher does not exists, start creating ...")
            await user_repo.create(teacher)
        elif exists_user.role == UserRole.STUDENT:
            logger.info(
                "User with this ID is a `student` role, start delete and create teacher ..."
            )
            await user_repo.delete(teacher.id)
            await user_repo.create(teacher)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
