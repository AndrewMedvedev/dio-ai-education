from uuid import UUID

from pydantic import Field, PositiveInt

from ...core.base import Entity


class Group(Entity):
    """Группа студентов"""

    title: str = Field(
        ...,
        max_length=255,
        description="Название группы",
        examples=["АСОиУБ-23-1", "ИИПБ-25-2"]
    )
    description: str | None = Field(None, description="Описание группы")
    created_by: UUID = Field(..., description="ID создателя (преподавателя) группы")
    course_id: UUID = Field(..., description="ID курса к которому привязана группа")
    max_students: PositiveInt | None = Field(None, le=250, description="Лимит участников")
    is_private: bool = Field(
        True,
        description="Для приватных групп присоединение происходит по приглашению"
    )
