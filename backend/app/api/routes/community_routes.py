"""
Community API Routes — full CRUD for threads, posts, members, events, settings.

Public (no auth):
  GET  /api/community/settings        — community settings
  GET  /api/community/threads         — list threads
  GET  /api/community/threads/:id     — thread detail + posts
  GET  /api/community/events          — list events

Admin only:
  POST/PUT/DELETE threads, posts, members, events, settings
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_admin_user
from app.models.user import User
from app.models.community import (
    CommunityThread, CommunityPost, CommunityMember,
    CommunityEvent, CommunitySettings,
    ThreadStatus, MemberRole, EventType, EventStatus,
)

router = APIRouter(prefix="/community", tags=["community"])

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class ThreadCreate(BaseModel):
    title: str
    body: Optional[str] = None
    author_name: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    status: ThreadStatus = ThreadStatus.OPEN
    is_featured: bool = False


class ThreadUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[ThreadStatus] = None
    is_featured: Optional[bool] = None


class PostCreate(BaseModel):
    thread_id: int
    body: str
    author_name: Optional[str] = None
    is_accepted_answer: bool = False


class PostUpdate(BaseModel):
    body: Optional[str] = None
    is_accepted_answer: Optional[bool] = None
    is_hidden: Optional[bool] = None


class MemberUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[MemberRole] = None
    badges: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_banned: Optional[bool] = None


class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: EventType = EventType.WEBINAR
    status: EventStatus = EventStatus.UPCOMING
    host_name: Optional[str] = None
    meeting_url: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: int = 60
    max_participants: Optional[int] = None
    tags: Optional[List[str]] = []
    thumbnail_url: Optional[str] = None
    is_featured: bool = False


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[EventType] = None
    status: Optional[EventStatus] = None
    host_name: Optional[str] = None
    meeting_url: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    max_participants: Optional[int] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = None


class CommunitySettingsUpdate(BaseModel):
    welcome_message: Optional[str] = None
    rules: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    features_enabled: Optional[Dict[str, Any]] = None
    stats_override: Optional[Dict[str, Any]] = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_or_create_settings(db: Session) -> CommunitySettings:
    s = db.query(CommunitySettings).first()
    if not s:
        s = CommunitySettings(
            welcome_message="Welcome to the MAD Genie Community!",
            rules=["Be respectful", "No spam", "Stay on topic"],
            categories=["General", "Projects", "Career", "Events", "Resources"],
            features_enabled={"threads": True, "events": True, "members": True},
            stats_override={},
        )
        db.add(s)
        db.commit()
        db.refresh(s)
    return s


# ---------------------------------------------------------------------------
# Community Settings
# ---------------------------------------------------------------------------

@router.get("/settings")
async def get_community_settings(db: Session = Depends(get_db)):
    return _get_or_create_settings(db).to_dict()


@router.put("/settings")
async def update_community_settings(
    payload: CommunitySettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    s = _get_or_create_settings(db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(s, field, value)
    try:
        db.commit()
        db.refresh(s)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return s.to_dict()


# ---------------------------------------------------------------------------
# Threads
# ---------------------------------------------------------------------------

@router.get("/threads")
async def list_threads(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    q = db.query(CommunityThread)
    if category:
        q = q.filter(CommunityThread.category == category)
    if featured is not None:
        q = q.filter(CommunityThread.is_featured == featured)
    threads = q.order_by(CommunityThread.created_at.desc()).all()
    return [t.to_dict() for t in threads]


@router.get("/threads/{thread_id}")
async def get_thread(thread_id: int, db: Session = Depends(get_db)):
    thread = db.query(CommunityThread).filter(CommunityThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    posts = db.query(CommunityPost).filter(
        CommunityPost.thread_id == thread_id,
        CommunityPost.is_hidden == False,
    ).order_by(CommunityPost.created_at).all()
    return {**thread.to_dict(), "posts": [p.to_dict() for p in posts]}


@router.post("/threads", status_code=status.HTTP_201_CREATED)
async def create_thread(
    payload: ThreadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    thread = CommunityThread(**payload.model_dump())
    db.add(thread)
    try:
        db.commit()
        db.refresh(thread)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return thread.to_dict()


@router.put("/threads/{thread_id}")
async def update_thread(
    thread_id: int,
    payload: ThreadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    thread = db.query(CommunityThread).filter(CommunityThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(thread, field, value)
    try:
        db.commit()
        db.refresh(thread)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return thread.to_dict()


@router.delete("/threads/{thread_id}")
async def delete_thread(
    thread_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    thread = db.query(CommunityThread).filter(CommunityThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    db.delete(thread)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return {"success": True}


# ---------------------------------------------------------------------------
# Posts (replies)
# ---------------------------------------------------------------------------

@router.post("/posts", status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    thread = db.query(CommunityThread).filter(CommunityThread.id == payload.thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    post = CommunityPost(**payload.model_dump())
    db.add(post)
    thread.reply_count = (thread.reply_count or 0) + 1
    try:
        db.commit()
        db.refresh(post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return post.to_dict()


@router.put("/posts/{post_id}")
async def update_post(
    post_id: int,
    payload: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    try:
        db.commit()
        db.refresh(post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return post.to_dict()


@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return {"success": True}


# ---------------------------------------------------------------------------
# Members
# ---------------------------------------------------------------------------

@router.get("/members")
async def list_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    members = db.query(CommunityMember).order_by(CommunityMember.joined_at.desc()).all()
    return [m.to_dict() for m in members]


@router.put("/members/{member_id}")
async def update_member(
    member_id: int,
    payload: MemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    member = db.query(CommunityMember).filter(CommunityMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    try:
        db.commit()
        db.refresh(member)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return member.to_dict()


@router.delete("/members/{member_id}")
async def delete_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    member = db.query(CommunityMember).filter(CommunityMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return {"success": True}


# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------

@router.get("/events")
async def list_events(
    event_status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(CommunityEvent)
    if event_status:
        q = q.filter(CommunityEvent.status == event_status)
    events = q.order_by(CommunityEvent.scheduled_at).all()
    return [e.to_dict() for e in events]


@router.post("/events", status_code=status.HTTP_201_CREATED)
async def create_event(
    payload: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    event = CommunityEvent(**payload.model_dump())
    db.add(event)
    try:
        db.commit()
        db.refresh(event)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return event.to_dict()


@router.put("/events/{event_id}")
async def update_event(
    event_id: int,
    payload: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    event = db.query(CommunityEvent).filter(CommunityEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    try:
        db.commit()
        db.refresh(event)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return event.to_dict()


@router.delete("/events/{event_id}")
async def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    event = db.query(CommunityEvent).filter(CommunityEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return {"success": True}
