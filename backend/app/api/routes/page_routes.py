"""
Pages API Routes — Dynamic page management (linked to header/footer nav).
GET    /api/pages           — list all pages (admin)
POST   /api/pages           — create a page (admin)
GET    /api/pages/public    — list published pages (public, for nav building)
GET    /api/pages/:id       — get single page (admin)
GET    /api/pages/slug/:slug — get page by slug (public)
PUT    /api/pages/:id       — update a page (admin)
DELETE /api/pages/:id       — delete a page (admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_admin_user
from app.models.user import User
from app.models.page import Page

router = APIRouter(prefix="/pages", tags=["pages"])


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class PageCreate(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None
    meta_description: Optional[str] = None
    parent_slug: Optional[str] = None
    in_header_nav: bool = False
    in_footer_platform: bool = False
    in_footer_resources: bool = False
    in_footer_company: bool = False
    nav_order: int = 0
    is_published: bool = True


class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    meta_description: Optional[str] = None
    parent_slug: Optional[str] = None
    in_header_nav: Optional[bool] = None
    in_footer_platform: Optional[bool] = None
    in_footer_resources: Optional[bool] = None
    in_footer_company: Optional[bool] = None
    nav_order: Optional[int] = None
    is_published: Optional[bool] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/public")
async def list_public_pages(db: Session = Depends(get_db)):
    """Return all published pages — used by frontend to build nav dynamically."""
    pages = db.query(Page).filter(Page.is_published == True).order_by(Page.nav_order).all()
    return [p.to_dict() for p in pages]


@router.get("/slug/{slug}")
async def get_page_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a published page by slug."""
    page = db.query(Page).filter(Page.slug == slug, Page.is_published == True).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return page.to_dict()


@router.get("")
async def list_pages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    pages = db.query(Page).order_by(Page.nav_order).all()
    return [p.to_dict() for p in pages]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_page(
    payload: PageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    # Check slug uniqueness
    existing = db.query(Page).filter(Page.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already exists")
    page = Page(**payload.model_dump())
    db.add(page)
    try:
        db.commit()
        db.refresh(page)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return page.to_dict()


@router.get("/{page_id}")
async def get_page(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return page.to_dict()


@router.put("/{page_id}")
async def update_page(
    page_id: int,
    payload: PageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")

    # If slug is changing, verify uniqueness
    update_data = payload.model_dump(exclude_unset=True)
    if "slug" in update_data:
        clash = db.query(Page).filter(Page.slug == update_data["slug"], Page.id != page_id).first()
        if clash:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already in use")

    for field, value in update_data.items():
        setattr(page, field, value)
    try:
        db.commit()
        db.refresh(page)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return page.to_dict()


@router.delete("/{page_id}")
async def delete_page(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    db.delete(page)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return {"success": True}
