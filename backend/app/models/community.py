"""
Community data models.
Designed for expandability — covers forum threads, posts, members, events,
badges, and community-wide settings.
"""
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime,
    ForeignKey, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
import enum
from app.core.database import Base


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class ThreadStatus(str, enum.Enum):
    OPEN = "open"
    CLOSED = "closed"
    PINNED = "pinned"
    ARCHIVED = "archived"


class MemberRole(str, enum.Enum):
    MEMBER = "member"
    MODERATOR = "moderator"
    EXPERT = "expert"
    ADMIN = "admin"


class EventType(str, enum.Enum):
    WEBINAR = "webinar"
    HACKATHON = "hackathon"
    QA_SESSION = "qa_session"
    WORKSHOP = "workshop"
    MEETUP = "meetup"
    OTHER = "other"


class EventStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class CommunityThread(Base):
    """A top-level discussion thread / forum post."""
    __tablename__ = "community_threads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    body = Column(Text, nullable=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    author_name = Column(String(200), nullable=True)    # denormalised for display
    category = Column(String(100), nullable=True, index=True)   # e.g. "general", "projects"
    tags = Column(JSONB, default=list)
    status = Column(SAEnum(ThreadStatus, name="thread_status"), default=ThreadStatus.OPEN, nullable=False)
    view_count = Column(Integer, default=0)
    reply_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "author_id": self.author_id,
            "author_name": self.author_name,
            "category": self.category,
            "tags": self.tags or [],
            "status": self.status,
            "view_count": self.view_count,
            "reply_count": self.reply_count,
            "like_count": self.like_count,
            "is_featured": self.is_featured,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class CommunityPost(Base):
    """A reply/post inside a CommunityThread."""
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("community_threads.id", ondelete="CASCADE"), nullable=False, index=True)
    body = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    author_name = Column(String(200), nullable=True)
    like_count = Column(Integer, default=0)
    is_accepted_answer = Column(Boolean, default=False)
    is_hidden = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "thread_id": self.thread_id,
            "body": self.body,
            "author_id": self.author_id,
            "author_name": self.author_name,
            "like_count": self.like_count,
            "is_accepted_answer": self.is_accepted_answer,
            "is_hidden": self.is_hidden,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class CommunityMember(Base):
    """Extended community profile per user."""
    __tablename__ = "community_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    display_name = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(1000), nullable=True)
    role = Column(SAEnum(MemberRole, name="member_role"), default=MemberRole.MEMBER, nullable=False)
    badges = Column(JSONB, default=list)             # ["Gold Badge", "NLP Expert", …]
    reputation = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_banned = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_active_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "display_name": self.display_name,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "role": self.role,
            "badges": self.badges or [],
            "reputation": self.reputation,
            "is_active": self.is_active,
            "is_banned": self.is_banned,
            "joined_at": self.joined_at.isoformat() if self.joined_at else None,
            "last_active_at": self.last_active_at.isoformat() if self.last_active_at else None,
        }


class CommunityEvent(Base):
    """Live events, webinars, hackathons, Q&As managed from admin."""
    __tablename__ = "community_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(SAEnum(EventType, name="event_type"), default=EventType.WEBINAR, nullable=False)
    status = Column(SAEnum(EventStatus, name="event_status"), default=EventStatus.UPCOMING, nullable=False)
    host_name = Column(String(200), nullable=True)
    meeting_url = Column(String(1000), nullable=True)      # Zoom/Meet/YouTube link
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, default=60)
    max_participants = Column(Integer, nullable=True)
    participant_count = Column(Integer, default=0)
    tags = Column(JSONB, default=list)
    thumbnail_url = Column(String(1000), nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "event_type": self.event_type,
            "status": self.status,
            "host_name": self.host_name,
            "meeting_url": self.meeting_url,
            "scheduled_at": self.scheduled_at.isoformat() if self.scheduled_at else None,
            "duration_minutes": self.duration_minutes,
            "max_participants": self.max_participants,
            "participant_count": self.participant_count,
            "tags": self.tags or [],
            "thumbnail_url": self.thumbnail_url,
            "is_featured": self.is_featured,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class CommunitySettings(Base):
    """Admin-controlled community-wide settings (single row, key='community')."""
    __tablename__ = "community_settings"

    id = Column(Integer, primary_key=True)
    welcome_message = Column(Text, nullable=True, default="Welcome to the community!")
    rules = Column(JSONB, default=list)              # list of rule strings
    categories = Column(JSONB, default=list)         # forum categories
    features_enabled = Column(JSONB, default=dict)   # {"threads":true,"events":true,...}
    stats_override = Column(JSONB, default=dict)     # admin can override displayed stats
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "welcome_message": self.welcome_message,
            "rules": self.rules or [],
            "categories": self.categories or [],
            "features_enabled": self.features_enabled or {},
            "stats_override": self.stats_override or {},
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
