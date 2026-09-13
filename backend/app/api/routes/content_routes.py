"""
Content Management API Routes
GET    /api/content/courses       — list all courses (admin)
POST   /api/content/courses       — create a course (admin)
GET    /api/content/courses/:id   — get a single course (admin)
PUT    /api/content/courses/:id   — update a course (admin)
DELETE /api/content/courses/:id   — delete a course (admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_admin_user
from app.models.user import User
from app.models.course import Course, CourseStatus

router = APIRouter(prefix="/content", tags=["content"])


# ---------------------------------------------------------------------------
# Pydantic schemas (inline — no separate schemas file needed)
# ---------------------------------------------------------------------------

class CourseCreate(BaseModel):
    title: str
    instructor: str
    category: Optional[str] = None
    status: CourseStatus = CourseStatus.DRAFT
    description: Optional[str] = None
    duration: Optional[str] = None
    lessons_count: int = 0
    thumbnail_url: Optional[str] = None


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    instructor: Optional[str] = None
    category: Optional[str] = None
    status: Optional[CourseStatus] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    lessons_count: Optional[int] = None
    thumbnail_url: Optional[str] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/courses")
async def list_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Return all courses ordered by creation date desc."""
    courses = db.query(Course).order_by(Course.created_at.desc()).all()
    return [c.to_dict() for c in courses]


@router.post("/courses", status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Create a new course."""
    course = Course(
        title=payload.title,
        instructor=payload.instructor,
        category=payload.category,
        status=payload.status,
        description=payload.description,
        duration=payload.duration,
        lessons_count=payload.lessons_count,
        thumbnail_url=payload.thumbnail_url,
    )
    db.add(course)
    try:
        db.commit()
        db.refresh(course)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create course: {str(e)}",
        )
    return course.to_dict()


@router.get("/courses/{course_id}")
async def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Get a single course by ID."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course.to_dict()


@router.put("/courses/{course_id}")
async def update_course(
    course_id: int,
    payload: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Update an existing course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)

    try:
        db.commit()
        db.refresh(course)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update course: {str(e)}",
        )
    return course.to_dict()


@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Delete a course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    db.delete(course)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete course: {str(e)}",
        )
    return {"success": True, "message": "Course deleted successfully."}
