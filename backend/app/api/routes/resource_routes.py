"""
Resources & Playbooks API Routes
GET    /api/resources/public   — public list (no auth, supports category & is_public filtering)
GET    /api/resources          — list all (admin)
POST   /api/resources          — create (admin, validates category against site_settings)
GET    /api/resources/:id      — get single (admin)
PUT    /api/resources/:id      — update (admin, validates category against site_settings)
DELETE /api/resources/:id      — delete (admin)
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_admin_user
from app.models.user import User
from app.models.resource import Resource
from app.models.site_settings import SiteSetting

router = APIRouter(prefix="/resources", tags=["resources"])


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class ResourceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    content_type: str = "guide"  # guide, template, checklist, download
    is_featured: bool = False
    is_public: bool = True
    read_time_minutes: Optional[int] = None
    file_url: Optional[str] = None
    published_at: Optional[datetime] = None
    difficulty: Optional[str] = None
    duration: Optional[str] = None
    author: Optional[str] = None
    thumbnail_url: Optional[str] = None
    resource_url: Optional[str] = None
    tags: Optional[List[str]] = []
    rating: float = 0.0
    downloads: int = 0
    is_published: bool = True
    parent_id: Optional[int] = None
    nav_order: int = 0


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    content_type: Optional[str] = None
    is_featured: Optional[bool] = None
    is_public: Optional[bool] = None
    read_time_minutes: Optional[int] = None
    file_url: Optional[str] = None
    published_at: Optional[datetime] = None
    difficulty: Optional[str] = None
    duration: Optional[str] = None
    author: Optional[str] = None
    thumbnail_url: Optional[str] = None
    resource_url: Optional[str] = None
    tags: Optional[List[str]] = None
    rating: Optional[float] = None
    downloads: Optional[int] = None
    is_published: Optional[bool] = None
    parent_id: Optional[int] = None
    nav_order: Optional[int] = None


# ---------------------------------------------------------------------------
# Helper: Validate category dynamically against site_settings
# ---------------------------------------------------------------------------

def _validate_category(db: Session, category: Optional[str]) -> None:
    if not category or category.strip() == "":
        return
    row = db.query(SiteSetting).filter(SiteSetting.key == "playbook_categories").first()
    valid_categories = []
    if row and row.value and isinstance(row.value, list):
        for item in row.value:
            if isinstance(item, dict):
                if "id" in item:
                    valid_categories.append(item["id"].lower())
                if "name" in item:
                    valid_categories.append(item["name"].lower())
            elif isinstance(item, str):
                valid_categories.append(item.lower())

    if valid_categories and category.lower() not in valid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category '{category}'. Allowed categories: {', '.join(set(valid_categories))}",
        )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/public")
async def list_public_resources(
    category: Optional[str] = None,
    content_type: Optional[str] = None,
    is_public: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """Public endpoint — returns published playbooks/resources."""
    q = db.query(Resource).filter(Resource.is_published == True)
    if category and category != "all":
        q = q.filter(Resource.category == category)
    if content_type and content_type != "all":
        q = q.filter(Resource.content_type == content_type)
    if is_public is not None:
        q = q.filter(Resource.is_public == is_public)
    resources = q.order_by(Resource.is_featured.desc(), Resource.nav_order, Resource.created_at.desc()).all()
    return [r.to_dict() for r in resources]


@router.get("")
async def list_resources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    resources = db.query(Resource).order_by(Resource.nav_order, Resource.created_at.desc()).all()
    return [r.to_dict() for r in resources]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_resource(
    payload: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    _validate_category(db, payload.category)
    resource = Resource(**payload.model_dump())
    db.add(resource)
    try:
        db.commit()
        db.refresh(resource)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return resource.to_dict()


@router.get("/{resource_id}")
async def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return resource.to_dict()


@router.put("/{resource_id}")
async def update_resource(
    resource_id: int,
    payload: ResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    data = payload.model_dump(exclude_unset=True)
    if "category" in data:
        _validate_category(db, data["category"])
    for field, value in data.items():
        setattr(resource, field, value)
    try:
        db.commit()
        db.refresh(resource)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return resource.to_dict()


@router.delete("/{resource_id}")
async def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    db.delete(resource)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return {"success": True}
