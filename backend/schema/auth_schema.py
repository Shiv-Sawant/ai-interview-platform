from pydantic import BaseModel, EmailStr
from typing import Optional
from utils.auth_util import userRoleEnum


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: userRoleEnum = userRoleEnum.USER


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: userRoleEnum

    model_config = {"from_attributes": True}


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
