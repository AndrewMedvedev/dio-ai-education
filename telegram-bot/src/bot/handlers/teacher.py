from aiogram import Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import BufferedInputFile, Message

from src.app.services import export_performance_reports
from src.core.entities.user import UserRole
from src.infra.db.conn import session_factory
from src.infra.db.repos import StudentRepository

router = Router(name=__name__)


@router.message(Command("students_performance"))
async def cmd_students_performance(message: Message, state: FSMContext) -> None:
    """Получение списка студентов для каждой группы"""

    data = await state.get_data()
    user_role = data.get("user_role")
    if user_role is None or user_role != UserRole.TEACHER:
        await message.answer("🚫 Доступ запрещён!")
        await state.clear()
        return
    report_by_group = {}
    async with session_factory() as session:
        student_repo = StudentRepository(session)
        groups = await student_repo.get_groups()
        await message.answer("Начинаю формировать отчёт ...")
        for group in groups:
            student_performances = await student_repo.get_student_performances(group.id)
            report_by_group[group.title] = student_performances
    excel_data = export_performance_reports(report_by_group)
    await message.bot.send_document(
        chat_id=message.chat.id,
        document=BufferedInputFile(file=excel_data, filename="Отчёт_по_успеваемости.xlsx")
    )
