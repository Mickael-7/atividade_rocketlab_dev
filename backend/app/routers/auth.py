from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends
from pydantic import BaseModel

from app.auth import criar_token, verificar_senha
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Autenticação"])


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends()):
    email_ok = verificar_senha(form.username, settings.ADMIN_EMAIL)
    senha_ok = verificar_senha(form.password, settings.ADMIN_PASSWORD)

    if not email_ok or not senha_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = criar_token({"sub": settings.ADMIN_EMAIL})
    return TokenResponse(access_token=token)
