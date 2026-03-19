from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Path, status
from fastapi.security import OAuth2PasswordRequestForm

from ..dependencies import AuthServiceDep
from ..entities import Tokens
from ..schemas import UserCreateForm, UserSignUp

router = APIRouter(prefix="/auth", tags=["Авторизация"])


@router.post(
    path="/signup",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=dict[str, str],
    summary="email-first регистрация",
    description="Отправляет письмо в фоновой задаче для подтверждения указанного email"
)
async def signup(
        data: UserSignUp,
        service: AuthServiceDep,
        background_tasks: BackgroundTasks,
) -> dict[str, str]:
    background_tasks.add_task(service.send_email_confirmation, email=data.email)
    return {"message": "Приглашение будет отправлено в ближайшее время"}


@router.post(
    path="/register/{token}",
    status_code=status.HTTP_201_CREATED,
    response_model=Tokens,
    summary="Регистрация пользователя по приглашению",
    responses={
        201: {"description": "Успешная регистрация"},
        404: {"description": "Приглашение не было найдено или не активно"},
        409: {"description": "Пользователь уже зарегистрирован"},
    }
)
async def register(
        token: Annotated[str, Path(..., description="Токен из пригласительного письма")],
        data: UserCreateForm,
        service: AuthServiceDep,
) -> Tokens:
    return await service.register(token, data)


@router.post(
    path="/login",
    status_code=status.HTTP_200_OK,
    response_model=Tokens,
    summary="Аутентификация",
    description="Вход в учётную запись (получение пары токенов access и refresh)",
    responses={
        200: {"description": "Успешная аутентификация"},
        401: {"description": "Неверные учётные данные (email или пароль)"}
    }
)
async def login(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        service: AuthServiceDep,
) -> Tokens:
    return await service.authenticate(form_data.username, form_data.password)
