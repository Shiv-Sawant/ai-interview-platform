from fastapi import FastAPI
from routers.route import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    version="0.0.1",
    title="Ai Interview Platform",
    description="Ai Interview Platform using python and react",
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
