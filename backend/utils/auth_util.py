from enum import Enum
from pwdlib import PasswordHash
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from utils.config import AppConfig
from model.common_models import User
from database.db import get_db

appconfig = AppConfig()

security = HTTPBearer()


class userRoleEnum(str, Enum):
    USER = "user"
    RECRUITER = "recruiter"


password_context = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(plain_pass: str, hash_password: str) -> bool:
    return password_context.verify(plain_pass, hash_password)


def create_access_token(user_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=appconfig.JWT_EXPIRE_MINUTES
    )

    payload = {"sub": str(user_id), "role": role, "exp": expire}

    return jwt.encode(payload, appconfig.JWT_SECRET, algorithm=appconfig.JWT_ALGORITHM)


def decode_access_token(token: str):
    try:
        return jwt.decode(
            token, appconfig.JWT_SECRET, algorithms=[appconfig.JWT_ALGORITHM]
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    token = credentials.credentials

    payload = decode_access_token(token)

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    result = await db.execute(select(User).where(User.id == int(user_id)))

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    return user


async def require_user(current_user: User = Depends(get_current_user)):
    if current_user.role != userRoleEnum.USER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User access required",
        )

    return current_user


async def require_recruiter(current_user: User = Depends(get_current_user)):
    if current_user.role != userRoleEnum.RECRUITER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiter access required",
        )

    return current_user
