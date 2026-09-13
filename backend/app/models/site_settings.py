from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.core.database import Base


class SiteSetting(Base):
    """
    Key-value store for all site settings.
    Each row is one logical group (e.g. 'general', 'brand', 'pricing').
    value is a JSONB blob so we can store arbitrary nested data.
    """
    __tablename__ = "site_settings"

    key = Column(String(100), primary_key=True, index=True)
    value = Column(JSONB, nullable=False, default={})
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self):
        return f"<SiteSetting(key='{self.key}')>"
