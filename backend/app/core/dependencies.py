from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import AuthService, AuthenticationError, AuthorizationError
from app.models.user import User, UserRole

# Security scheme for JWT token
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from JWT token
    """
    token = credentials.credentials
    user = AuthService.get_user_from_token(token, db)
    
    if user is None:
        raise AuthenticationError("Invalid authentication credentials")
    
    if not user.is_active:
        raise AuthenticationError("Inactive user")
    
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to get current active user
    """
    if not current_user.is_active:
        raise AuthenticationError("Inactive user")
    return current_user

async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure current user is admin or super admin
    """
    if not current_user.is_admin():
        raise AuthorizationError("Admin access required")
    return current_user

async def get_current_super_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure current user is super admin
    """
    if not current_user.is_super_admin():
        raise AuthorizationError("Super admin access required")
    return current_user

# Optional authentication (for public endpoints that can show different content for logged-in users)
async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Dependency to optionally get current user (no error if not authenticated)
    """
    if credentials is None:
        return None
    
    token = credentials.credentials
    user = AuthService.get_user_from_token(token, db)
    
    if user and user.is_active:
        return user
    return None

# Role-based dependencies
def require_role(required_role: UserRole):
    """
    Factory function to create role-based dependencies
    """
    async def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != required_role:
            raise AuthorizationError(f"Role '{required_role.value}' required")
        return current_user
    
    return role_dependency

def require_any_role(*required_roles: UserRole):
    """
    Factory function to create dependencies that accept multiple roles
    """
    async def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in required_roles:
            roles_str = ", ".join([role.value for role in required_roles])
            raise AuthorizationError(f"One of these roles required: {roles_str}")
        return current_user
    
    return role_dependency

# Permission-based dependencies
async def require_user_management_permission(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure user can manage other users
    """
    if not current_user.is_admin():
        raise AuthorizationError("User management permission required")
    return current_user

async def require_admin_panel_access(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure user can access admin panel
    """
    if not current_user.is_admin():
        raise AuthorizationError("Admin panel access required")
    return current_user