from fastapi import APIRouter, Depends

from app.core.security import get_current_user, require_role
from app.schemas.auth import UserOut
from app.models.user import User, UserRole

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/admin-only", dependencies=[Depends(require_role(UserRole.admin))])
def admin_only_route():
    """Example of an RBAC-protected route. Only users with role=admin can reach this."""
    return {"message": "If you can see this, you are an admin."}
