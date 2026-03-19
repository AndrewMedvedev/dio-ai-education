from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from ..core.dependencies import SessionDep
from .services import AuthService, InvitationService

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT Bearer",
    description="Вставьте JWT-токен (access token)",
)


def get_invitation_service(session: SessionDep) -> InvitationService:
    return InvitationService(session)


def get_auth_service(session: SessionDep) -> AuthService:
    return AuthService(session)


InvitationServiceDep = Annotated[InvitationService, Depends(get_invitation_service)]
AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
