from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import eng, Base
from routes.mtg import r as mtg_router


Base.metadata.create_all(bind=eng)

app = FastAPI(title="Zoom Clone API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://zoom-clone-assignment-two.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mtg_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Zoom Clone API is running"
    }