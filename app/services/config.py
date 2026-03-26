from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, Field


class Settings(BaseModel):
    """
    Lazy-loaded environment settings.

    Importing this module should not fail if .env values are missing;
    validation happens when `get_settings()` is called.
    """

    model_config = ConfigDict(extra="forbid")

    anthropic_api_key: str = Field(..., min_length=1)
    supabase_url: str = Field(..., min_length=1)
    supabase_key: str = Field(..., min_length=1)


_REPO_ROOT = Path(__file__).resolve().parents[2]

# Load .env once so env-based reads work immediately across modules.
load_dotenv(dotenv_path=_REPO_ROOT / ".env")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    supabase_key = os.getenv("SUPABASE_KEY", "").strip()

    missing = []
    if not anthropic_api_key:
        missing.append("ANTHROPIC_API_KEY")
    if not supabase_url:
        missing.append("SUPABASE_URL")
    if not supabase_key:
        missing.append("SUPABASE_KEY")

    if missing:
        missing_list = ", ".join(missing)
        raise RuntimeError(
            f"Missing required environment variables in .env: {missing_list}"
        )

    return Settings(
        anthropic_api_key=anthropic_api_key,
        supabase_url=supabase_url,
        supabase_key=supabase_key,
    )

