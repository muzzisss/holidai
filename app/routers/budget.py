from fastapi import APIRouter
from app.services.budget_service import calculate_budget, get_budget_estimates
from app.models.schemas import BudgetCalculateRequest

router = APIRouter()


@router.post("/calculate")
async def calculate(request: BudgetCalculateRequest):
    params = request.model_dump()
    result = calculate_budget(params)
    return result


@router.get("/estimates")
async def estimates():
    results = get_budget_estimates()
    return {"estimates": results, "count": len(results)}
