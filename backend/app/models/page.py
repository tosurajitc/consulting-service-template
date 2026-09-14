from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Page(Base):
    """Dynamic pages created from admin. Can be linked to header/footer nav."""
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=True)          # HTML/markdown body
    meta_description = Column(String(500), nullable=True)
    parent_slug = Column(String(255), nullable=True, index=True)  # for sub-pages
    in_header_nav = Column(Boolean, default=False, nullable=False)
    in_footer_platform = Column(Boolean, default=False, nullable=False)
    in_footer_resources = Column(Boolean, default=False, nullable=False)
    in_footer_company = Column(Boolean, default=False, nullable=False)
    nav_order = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "meta_description": self.meta_description,
            "parent_slug": self.parent_slug,
            "in_header_nav": self.in_header_nav,
            "in_footer_platform": self.in_footer_platform,
            "in_footer_resources": self.in_footer_resources,
            "in_footer_company": self.in_footer_company,
            "nav_order": self.nav_order,
            "is_published": self.is_published,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
