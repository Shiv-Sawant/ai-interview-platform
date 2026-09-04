from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from database.db import create_tables

from routers.interview_route import interview_route
from routers.auth_route import auth_router
from routers.dashboard_route import dashboard_route
from routers.recruiter_route import recruiter_route

from utils.interview_util import AppException
from contextlib import asynccontextmanager

import model.common_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()

    yield


app = FastAPI(
    lifespan=lifespan,
    version="0.0.1",
    title="Ai Interview Platform",
    description="Ai Interview Platform using python and react",
)


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception,
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
        },
    )


@app.exception_handler(AppException)
async def app_exception_handler(
    request: Request,
    exc: AppException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
        },
    )


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_credentials=["*"],
    allow_headers=["*"],
)


app.include_router(recruiter_route)
app.include_router(interview_route, tags=["interview"])
app.include_router(auth_router, tags=["auth"])
app.include_router(dashboard_route, tags=["dashboard"])
