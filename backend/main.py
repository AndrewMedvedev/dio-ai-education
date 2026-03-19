import logging
import sys
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import uvicorn
from fastapi import APIRouter, FastAPI

from src.core.utils import run_cli_command
from src.iam.routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    await run_cli_command(sys.executable, "-m", "cli", "create-first-admin")
    yield


app = FastAPI(lifespan=lifespan)

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)

app.include_router(router)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    uvicorn.run(app, host="0.0.0.0", port=8000)  # noqa: S104
