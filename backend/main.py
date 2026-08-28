from fastapi import FastAPI, Request
from routers.route import router
from fastapi.middleware.cors import CORSMiddleware
from utils.interview_util import AppException
from fastapi.responses import JSONResponse

app = FastAPI(
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

app.include_router(router)
