from schema.auth_schema import RegisterRequest, LoginRequest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.common_models import User
from fastapi import status, HTTPException
from utils.auth_util import hash_password, verify_password, create_access_token


async def RegisterController(request: RegisterRequest, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == request.email))

    existing_result = result.scalar_one_or_none()

    if existing_result:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Already Register"
        )

    user = User(
        full_name=request.full_name,
        email=request.email,
        password=hash_password(request.password),
        role=request.role,
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user


async def LoginController(request: LoginRequest, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == request.email))

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Invalid Credentials"
        )

    if not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Invalid Credentials"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Your Account Is Disabled"
        )

    token = create_access_token(user_id=user.id, role=user.role)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }

async def update_user_profile_controller(
    payload,
    current_user,
    db: AsyncSession,
):
    if payload.full_name is not None:
        full_name = payload.full_name.strip()

        if not full_name:
            raise HTTPException(
                status_code=400,
                detail="Full name cannot be empty",
            )

        current_user.full_name = full_name

    await db.commit()
    await db.refresh(current_user)

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
    }
