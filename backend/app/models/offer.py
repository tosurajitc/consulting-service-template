from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class OfferStatus(str, enum.Enum):
    PUBLISHED = "Published"
    DRAFT = "Draft"
    REVIEW = "Review"
    ARCHIVED = "Archived"


class OfferType(str, enum.Enum):
    COURSE = "course"
    DIGITAL_PRODUCT = "digital_product"
    COACHING = "coaching"
    SERVICE = "service"


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    instructor = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    status = Column(SAEnum(OfferStatus), default=OfferStatus.DRAFT, nullable=False)
    offer_type = Column(SAEnum(OfferType), default=OfferType.COURSE, nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(String(50), nullable=True)          # e.g. "12 hours"
    lessons_count = Column(Integer, default=0, nullable=False)
    thumbnail_url = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Offer(id={self.id}, title='{self.title}', status='{self.status}')>"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "instructor": self.instructor,
            "category": self.category,
            "status": self.status.value if self.status else None,
            "offer_type": self.offer_type.value if self.offer_type else None,
            "description": self.description,
            "duration": self.duration,
            "lessons_count": self.lessons_count,
            "thumbnail_url": self.thumbnail_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
