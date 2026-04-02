from datetime import date
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy import delete, desc, func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ...app.schemas import Leader
from ...core.entities.course import Course, Module
from ...core.entities.student import (
    DailyChatLimit,
    Group,
    LearningProgress,
    ModulePerformance,
    StudentPerformance,
    StudentTask,
)
from ...core.entities.user import AnyUser, Student, Teacher
from .base import Base
from .models import (
    AnyUserOrm,
    CourseOrm,
    DailyChatLimitOrm,
    GroupOrm,
    LearningProgressOrm,
    ModuleOrm,
    StudentOrm,
    StudentTaskOrm,
    TeacherOrm,
    UserOrm,
)


class SqlAlchemyRepository[EntityT: BaseModel, ModelT: Base]:
    entity: type[EntityT]
    model: type[ModelT]

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, entity: EntityT) -> None:
        stmt = insert(self.model).values(**entity.model_dump())
        await self.session.execute(stmt)
        await self.session.flush()
        await self.session.commit()

    async def read(self, id: UUID) -> EntityT | None:  # noqa: A002
        stmt = select(self.model).where(self.model.id == id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else self.entity.model_validate(model)

    async def update(self, id: UUID, **kwargs) -> EntityT | None:  # noqa: A002
        stmt = (
            update(self.model)
            .where(self.model.id == id)
            .values(**kwargs)
            .returning(self.model)
        )
        result = await self.session.execute(stmt)
        await self.session.flush()
        await self.session.commit()
        model = result.scalar_one_or_none()
        return None if model is None else self.entity.model_validate(model)

    async def delete(self, id: UUID) -> None:  # noqa: A002
        stmt = delete(self.model).where(self.model.id == id)
        await self.session.execute(stmt)
        await self.session.commit()


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    @staticmethod
    def _to_orm(user: AnyUser) -> AnyUserOrm:
        if isinstance(user, Student):
            return StudentOrm(**user.model_dump())
        if isinstance(user, Teacher):
            return TeacherOrm(**user.model_dump())
        raise ValueError("Unexpected user instance!")

    @staticmethod
    def _from_orm(model: AnyUserOrm) -> AnyUser:
        if isinstance(model, StudentOrm):
            return Student.model_validate(model)
        if isinstance(model, TeacherOrm):
            return Teacher.model_validate(model)
        raise ValueError("Unexpected model instance!")

    async def create(self, user: AnyUser) -> None:
        model = self._to_orm(user)
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)

    async def read(self, user_id: int) -> AnyUser | None:
        stmt = select(UserOrm).where(UserOrm.id == user_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else self._from_orm(model)

    async def delete(self, user_id: int) -> None:
        stmt = delete(UserOrm).where(UserOrm.id == user_id)
        await self.session.execute(stmt)
        await self.session.commit()

    async def get_by_username(self, username: str) -> AnyUser | None:
        stmt = select(UserOrm).where(UserOrm.username == username)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else self._from_orm(model)


class StudentRepository(UserRepository):

    async def get_groups(self) -> list[Group]:
        stmt = select(GroupOrm)
        results = await self.session.execute(stmt)
        models = results.scalars().all()
        return [Group.model_validate(model) for model in models]

    async def get_student_group(self, student_id: int) -> Group | None:
        stmt = (
            select(GroupOrm)
            .join(StudentOrm, StudentOrm.group_id == GroupOrm.id)
            .where(StudentOrm.id == student_id)
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else Group.model_validate(model)

    async def save_learning_progress(self, progress: LearningProgress) -> None:
        stmt = insert(LearningProgressOrm).values(**progress.model_dump())
        await self.session.execute(stmt)
        await self.session.commit()

    async def get_learning_progress(self, student_id: int) -> LearningProgress | None:
        stmt = select(LearningProgressOrm).where(LearningProgressOrm.student_id == student_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else LearningProgress.model_validate(model)

    async def update_learning_progress(self, student_id: int, **kwargs) -> LearningProgress:
        stmt = (
            update(LearningProgressOrm)
            .where(LearningProgressOrm.student_id == student_id)
            .values(**kwargs)
            .returning(LearningProgressOrm)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        model = result.scalar_one()
        return LearningProgress.model_validate(model)

    async def refresh_learning_progress(self, progress: LearningProgress) -> None:
        model = LearningProgressOrm(**progress.model_dump())
        await self.session.merge(model)
        await self.session.commit()

    async def save_task(self, task: StudentTask) -> None:
        model = StudentTaskOrm(**task.model_dump())
        self.session.add(model)
        await self.session.commit()

    async def get_task(self, student_id: int, module_id: UUID) -> StudentTask | None:
        stmt = (
            select(StudentTaskOrm)
            .where(
                (StudentTaskOrm.student_id == student_id) &
                (StudentTaskOrm.module_id == module_id)
            )
            .order_by(StudentTaskOrm.created_at.desc())
            .limit(1)
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else StudentTask.model_validate(model)

    async def refresh_task(self, task: StudentTask) -> None:
        model = StudentTaskOrm(**task.model_dump())
        await self.session.merge(model)
        await self.session.commit()

    async def get_leaders(self, course_id: UUID, group_id: UUID, limit: int = 5) -> list[Leader]:
        rank = func.rank().over(order_by=desc(LearningProgressOrm.total_score))
        stmt = (
            select(
                StudentOrm.id,
                StudentOrm.full_name,
                StudentOrm.username,
                LearningProgressOrm.total_score,
                rank.label("rank")
            )
            .join(LearningProgressOrm, StudentOrm.id == LearningProgressOrm.student_id)
            .where(
                (StudentOrm.group_id == group_id) &
                (LearningProgressOrm.course_id == course_id)
            )
            .order_by(desc(LearningProgressOrm.total_score))
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        rows = result.all()
        return [
            Leader(
                user_id=row[0], full_name=row[1], username=row[2], total_score=row[3], rank=row[4]
            )
            for row in rows
        ]

    async def get_or_create_daily_chat_limit(
            self, user_id: int, today_date: date
    ) -> DailyChatLimit:
        stmt = (
            select(DailyChatLimitOrm)
            .where(
                (DailyChatLimitOrm.user_id == user_id) &
                (DailyChatLimitOrm.date == today_date)
            )
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        if model is None:
            model = DailyChatLimitOrm(
                user_id=user_id, date=today_date, max_count=10, current_count=0
            )
            self.session.add(model)
            await self.session.commit()
        return DailyChatLimit.model_validate(model)

    async def refresh_daily_chat_limit(self, chat_limit: DailyChatLimit) -> None:
        model = DailyChatLimitOrm(**chat_limit.model_dump())
        await self.session.merge(model)
        await self.session.commit()

    async def get_student_performances(self, group_id: UUID) -> list[StudentPerformance]:
        group_stmt = (
            select(GroupOrm)
            .where(GroupOrm.id == group_id)
            .options(selectinload(GroupOrm.students).joinedload(StudentOrm.learning_progress))
        )
        group = await self.session.scalar(group_stmt)
        if not group:
            raise ValueError(f"Group with {group_id} not found!")
        modules_stmt = (
            select(ModuleOrm)
            .where(ModuleOrm.course_id == group.course_id)
            .order_by(ModuleOrm.order)
        )
        results = await self.session.scalars(modules_stmt)
        modules = results.all()
        student_performances = []
        for student in group.students:
            learning_progress = student.learning_progress
            total_score = learning_progress.total_score if learning_progress else 0.0
            current_module_id = learning_progress.current_module_id if learning_progress else None
            score_per_module = learning_progress.score_per_module if learning_progress else {}
            current_title = next(
                (module.title for module in modules if str(module.id) == str(current_module_id)),
                None
            )
            module_performances = []
            for module in modules:
                module_id = str(module.id)
                progress = score_per_module.get(module_id, {})
                module_performances.append(
                    ModulePerformance(
                        module_title=module.title,
                        test_score=progress.get("test_score", 0.0),
                        test_attempts=progress.get("test_attempts", 0),
                        assignment_score=progress.get("assignment_score", 0.0),
                        is_test_passed=progress.get("is_test_passed", False),
                    )
                )
            student_performances.append(
                StudentPerformance(
                    student_id=student.id,
                    username=student.username,
                    full_name=student.full_name,
                    current_module_title=current_title,
                    total_score=total_score,
                    module_performances=module_performances,
                )
            )
        return student_performances


class CourseRepository(SqlAlchemyRepository[Course, CourseOrm]):
    entity = Course
    model = CourseOrm

    @staticmethod
    def _to_orm(course: Course) -> CourseOrm:
        """Маппинг сущности к ORM модели"""

        return CourseOrm(
            id=course.id,
            created_at=course.created_at,
            creator_id=course.creator_id,
            status=course.status,
            image_url=course.image_url,
            title=course.title,
            description=course.description,
            learning_objectives=course.learning_objectives,
            modules=[
                ModuleOrm(
                    id=module.id,
                    course_id=course.id,
                    order=module.order,
                    title=module.title,
                    description=module.description,
                    learning_objectives=module.learning_objectives,
                    content_blocks=[
                        content_block.model_dump() for content_block in module.content_blocks
                    ],
                    assignment=(
                        module.assignment.model_dump() if module.assignment is not None else None
                    ),
                )
                for module in course.modules
            ],
            final_assessment=(
                None if course.final_assessment is None else course.final_assessment.model_dump()
            ),
        )

    async def create(self, course: Course) -> None:
        model = self._to_orm(course)
        self.session.add(model)
        await self.session.commit()

    async def refresh(self, course: Course) -> None:
        model = self._to_orm(course)
        await self.session.merge(model)
        await self.session.commit()

    async def update_full(self, course: Course) -> None:
        # Удаляем все старые модули курса (чтобы избежать конфликта course_id)
        await self.session.execute(delete(ModuleOrm).where(ModuleOrm.course_id == course.id))
        # Теперь создаём свежий ORM-объект курса с новыми модулями
        model = self._to_orm(course)
        await self.session.merge(model)
        await self.session.commit()

    async def get_module(self, module_id: UUID) -> Module | None:
        stmt = select(ModuleOrm).where(ModuleOrm.id == module_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return None if model is None else Module.model_validate(model)
