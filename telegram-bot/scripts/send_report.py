import asyncio
import logging
import os

from aiogram import Bot
from aiogram.types import BufferedInputFile
from dotenv import load_dotenv

from src.app.services import export_performance_reports
from src.infra.db.conn import session_factory
from src.infra.db.repos import StudentRepository
from src.settings import ENV_PATH

load_dotenv(ENV_PATH)

ADMIN_ID = os.getenv("ADMIN_ID")
TEACHER_ID = os.getenv("TEACHER_ID")


async def main(bot: Bot) -> None:
    report_by_group = {}
    async with session_factory() as session:
        student_repo = StudentRepository(session)
        groups = await student_repo.get_groups()
        for group in groups:
            student_performances = await student_repo.get_student_performances(group.id)
            report_by_group[group.title] = student_performances
    excel_data = export_performance_reports(report_by_group)
    file_name = "Отчёт_по_успеваемости.xlsx"
    for user_id in [ADMIN_ID, TEACHER_ID]:
        await bot.send_document(
            chat_id=user_id,
            document=BufferedInputFile(file=excel_data, filename=file_name),
        )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
