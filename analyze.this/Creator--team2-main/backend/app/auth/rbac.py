from typing import Iterable

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.oauth2 import get_current_user
from app.models.user import User


def require_role(allowed_roles: Iterable[str]):
    allowed = set(allowed_roles)

    def dependency(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed:
            raise HTTPException(status_code=403, detail="Not authorized")
        return current_user

    return dependency

