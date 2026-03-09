from fastapi import APIRouter
from app.services.config import get_settings, update_settings
from app.models.schemas import UserSettings

router = APIRouter()


@router.get("/")
async def get_current_settings():
    settings = get_settings()
    # Mask API keys for security
    masked = {}
    for key, value in settings.items():
        if "key" in key.lower() or "secret" in key.lower():
            if value:
                masked[key] = value[:4] + "..." + value[-4:] if len(value) > 8 else "****"
            else:
                masked[key] = ""
        else:
            masked[key] = value
    return masked


@router.put("/")
async def update_current_settings(settings: UserSettings):
    data = {k: v for k, v in settings.model_dump().items() if v is not None}
    result = update_settings(data)
    # Mask for response
    masked = {}
    for key, value in result.items():
        if "key" in key.lower() or "secret" in key.lower():
            if value:
                masked[key] = value[:4] + "..." + value[-4:] if len(str(value)) > 8 else "****"
            else:
                masked[key] = ""
        else:
            masked[key] = value
    return masked
