from fastapi import APIRouter, Depends, Form, status
from controller.auth_controller import RegisterController, LoginController
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from schema.auth_schema import (
    UserResponse,
    RegisterRequest,
    LoginRequest,
    LoginResponse,
)
from model.common_models import User
from utils.auth_util import get_current_user

auth_router = APIRouter()


@auth_router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    return await RegisterController(request=request, db=db)


@auth_router.post(
    "/login", response_model=LoginResponse, status_code=status.HTTP_201_CREATED
)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    return await LoginController(request=request, db=db)


@auth_router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
