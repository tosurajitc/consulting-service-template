"""
Content Management API Routes
GET    /api/content/offers       — list all offers (admin)
POST   /api/content/offers       — create an offer (admin)
GET    /api/content/offers/:id   — get a single offer (admin)
PUT    /api/content/offers/:id   — update an offer (admin)
DELETE /api/content/offers/:id   — delete an offer (admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_admin_user
from app.models.user import User
from app.models.offer import Offer, OfferStatus, OfferType

router = APIRouter(prefix="/content", tags=["content"])


# ---------------------------------------------------------------------------
# Pydantic schemas (inline — no separate schemas file needed)
# ---------------------------------------------------------------------------

class OfferCreate(BaseModel):
    title: str
    instructor: str
    category: Optional[str] = None
    status: OfferStatus = OfferStatus.DRAFT
    offer_type: OfferType = OfferType.COURSE
    description: Optional[str] = None
    duration: Optional[str] = None
    lessons_count: int = 0
    thumbnail_url: Optional[str] = None


class OfferUpdate(BaseModel):
    title: Optional[str] = None
    instructor: Optional[str] = None
    category: Optional[str] = None
    status: Optional[OfferStatus] = None
    offer_type: Optional[OfferType] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    lessons_count: Optional[int] = None
    thumbnail_url: Optional[str] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/offers")
async def list_offers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Return all offers ordered by creation date desc."""
    offers = db.query(Offer).order_by(Offer.created_at.desc()).all()
    return [o.to_dict() for o in offers]


@router.post("/offers", status_code=status.HTTP_201_CREATED)
async def create_offer(
    payload: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new offer."""
    offer = Offer(
        title=payload.title,
        instructor=payload.instructor,
        category=payload.category,
        status=payload.status,
        offer_type=payload.offer_type,
        description=payload.description,
        duration=payload.duration,
        lessons_count=payload.lessons_count,
        thumbnail_url=payload.thumbnail_url,
    )
    db.add(offer)
    try:
        db.commit()
        db.refresh(offer)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create offer: {str(e)}",
        )
    return offer.to_dict()


@router.get("/offers/{offer_id}")
async def get_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Get a single offer by ID."""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")
    return offer.to_dict()


@router.put("/offers/{offer_id}")
async def update_offer(
    offer_id: int,
    payload: OfferUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing offer."""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(offer, field, value)

    try:
        db.commit()
        db.refresh(offer)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update offer: {str(e)}",
        )
    return offer.to_dict()


@router.delete("/offers/{offer_id}")
async def delete_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete an offer."""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer not found")

    db.delete(offer)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete offer: {str(e)}",
        )
    return {"success": True, "message": "Offer deleted successfully."}
