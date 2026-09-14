from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.core.database import Base


class ContentAsset(Base):
    """Content assets (books, docs, blog, templates, checklists, videos) managed from admin."""
    __tablename__ = "content_assets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True, index=True)   # ai-fundamentals, machine-learning, etc.
    resource_type = Column(String(50), nullable=True, index=True)  # tutorial, video, document, template, checklist, blog, book
    difficulty = Column(String(50), nullable=True)               # Beginner, Intermediate, Advanced
    duration = Column(String(100), nullable=True)                # e.g. "45 min read", "2 hours"
    author = Column(String(200), nullable=True)
    thumbnail_url = Column(String(1000), nullable=True)
    resource_url = Column(String(1000), nullable=True)           # External link or internal path
    tags = Column(JSONB, default=list)                           # ["Python", "ML", ...]
    rating = Column(Float, default=0.0)
    downloads = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    parent_id = Column(Integer, nullable=True, index=True)       # for sub-pages inside a resource
    nav_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "type": self.resource_type,
            "difficulty": self.difficulty,
            "duration": self.duration,
            "author": self.author,
            "thumbnail_url": self.thumbnail_url,
            "resource_url": self.resource_url,
            "tags": self.tags or [],
            "rating": self.rating,
            "downloads": self.downloads,
            "featured": self.is_featured,
            "is_published": self.is_published,
            "parent_id": self.parent_id,
            "nav_order": self.nav_order,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
