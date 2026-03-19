from pydantic import BaseModel, EmailStr, Field


class UserSignUp(BaseModel):
    """Форма для email-first регистрации пользователя (студента)"""

    email: EmailStr = Field(..., description="Email пользователя")


class UserCreateForm(BaseModel):
    """Форма регистрации пользователя"""

    username: str | None = Field(
        None, description="Никнейм пользователя", examples=["IvanIvanov"]
    )
    full_name: str | None = Field(
        None, max_length=150, description="ФИО", examples=["Иванов Иван Иванович"]
    )
    password: str = Field(..., description="Пароль, который придумал пользователь")
