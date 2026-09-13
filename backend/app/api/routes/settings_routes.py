"""
Site Settings API Routes
GET  /api/settings         — returns all settings as a JSON object (admin only)
PUT  /api/settings         — saves the full or partial settings object (admin only)
GET  /api/settings/public  — returns safe public subset (no auth required)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, Dict

from app.core.database import get_db
from app.core.dependencies import get_current_admin_user
from app.models.user import User
from app.models.site_settings import SiteSetting

router = APIRouter(prefix="/settings", tags=["settings"])

# ---------------------------------------------------------------------------
# The default seed values (mirrors site.config.js so the DB has sane defaults)
# ---------------------------------------------------------------------------
DEFAULT_SETTINGS: Dict[str, Any] = {
    "general": {
        "siteName": "MAD Genie Platform",
        "siteDescription": "Master AI & Data with Intelligence",
        "adminEmail": "admin@madgenie.com",
        "supportEmail": "support@madgenie.com",
        "timezone": "UTC",
        "language": "en",
        "maintenanceMode": False,
        "registrationOpen": True,
        "emailVerification": True,
        "twoFactorRequired": False,
    },
    "security": {
        "sessionTimeout": 24,
        "passwordMinLength": 8,
        "passwordRequireSpecial": True,
        "passwordRequireNumbers": True,
        "passwordRequireUppercase": True,
        "maxLoginAttempts": 5,
        "accountLockoutDuration": 30,
        "ipWhitelist": ["127.0.0.1", "192.168.1.0/24"],
        "sslRequired": True,
        "rateLimitRequests": 1000,
        "rateLimitWindow": 15,
    },
    "email": {
        "provider": "gmail",
        "smtpHost": "smtp.gmail.com",
        "smtpPort": 587,
        "smtpUsername": "",
        "smtpPassword": "",
        "fromEmail": "madgenie@gmail.com",
        "fromName": "MAD Genie Platform",
        "replyToEmail": "support@madgenie.com",
        "enableSsl": True,
        "enableStartTls": True,
    },
    "brand": {
        "name": "MAD Genie",
        "tagline": "Master AI & Data",
        "description": "The world's most advanced AI learning platform.",
        "year": "2025",
    },
    "contact": {
        "email": "madgenie@gmail.com",
        "phone": "+91 9875561973",
        "location": "India",
    },
    "social": {
        "twitter": "https://twitter.com/madgenie",
        "linkedin": "https://linkedin.com/company/madgenie",
        "github": "https://github.com/madgenie",
        "youtube": "https://youtube.com/madgenie",
        "facebook": "https://facebook.com/madgenie",
        "instagram": "https://instagram.com/madgenie",
    },
    "hero": {
        "badge": "Next-Generation AI Learning Platform",
        "headline": "Master AI & Data With Your Personal Genie",
        "subheadline": "The only platform that combines a magical learning experience, real-world AI mastery, and intelligent mentorship to accelerate your data science and AI mastery.",
        "highlightWord": "intelligent mentorship",
        "cta": {
            "primary": {"text": "Start Learning for Free", "href": "/signup"},
            "secondary": {"text": "Watch AI in Action", "href": "/solutions"},
        },
    },
    "stats": [
        {"number": "50K+", "label": "Active Learners"},
        {"number": "1000+", "label": "AI Projects"},
        {"number": "95%", "label": "Job Success Rate"},
        {"number": "24/7", "label": "AI Support"},
    ],
    "trustedBy": ["Google", "Microsoft", "Tesla", "OpenAI"],
    "cta": {
        "headline": "Ready to Lead the AI Revolution?",
        "subheadline": "Don't just learn AI — master it with the most advanced learning platform ever built.",
        "primary": {"text": "Start Your Free Trial", "href": "/get-started"},
        "secondary": {"text": "Book a Demo", "href": "/demo"},
        "badges": [
            "No credit card required",
            "Set up in under 2 minutes",
            "Join 50,000+ AI professionals",
        ],
    },
    "pricing": {
        "currency": "₹",
        "annualDiscountPercent": 15,
        "studentDiscountPercent": 20,
        "plans": [
            {
                "name": "Free Starter",
                "description": "Perfect for getting started with AI learning",
                "monthlyPrice": 0,
                "badge": "Beginners",
                "buttonText": "Start Free",
                "target": "Students & Curious Learners",
                "highlight": False,
                "features": [
                    "Access to 3 foundational courses",
                    "Basic AI chatbot (20 queries/day)",
                    "Community forum access",
                    "Mobile app access",
                ],
                "restrictions": [
                    "No live mentorship",
                    "No certification",
                ],
            },
            {
                "name": "Self-Paced Pro",
                "description": "Complete learning journey at your own pace",
                "monthlyPrice": 500,
                "badge": "Most Popular",
                "buttonText": "Start 7-Day Free Trial",
                "target": "Working Professionals & Self-Learners",
                "highlight": False,
                "features": [
                    "All 50+ courses & learning paths",
                    "Unlimited AI chatbot queries",
                    "Certification upon completion",
                ],
                "restrictions": [
                    "No live mentorship",
                ],
            },
            {
                "name": "Mentorship Program",
                "description": "Premium learning with expert guidance",
                "monthlyPrice": 5000,
                "badge": "Best Value",
                "buttonText": "Book Consultation",
                "target": "Serious Career Changers & Professionals",
                "highlight": True,
                "features": [
                    "Everything in Self-Paced Pro",
                    "4 live mentor sessions/month",
                    "1-on-1 career guidance",
                ],
                "restrictions": [],
            },
        ],
        "faqs": [
            {
                "question": "Is there really a free tier?",
                "answer": "Yes! Our free tier gives you access to foundational courses and basic AI tools.",
            },
            {
                "question": "Can I switch plans anytime?",
                "answer": "Absolutely! You can upgrade or downgrade your plan at any time.",
            },
        ],
    },
}

# Public keys that are safe to expose without authentication
PUBLIC_KEYS = {"brand", "contact", "social", "hero", "stats", "trustedBy", "cta", "pricing"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_all_settings(db: Session) -> Dict[str, Any]:
    """Return all settings rows merged into a single dict."""
    rows = db.query(SiteSetting).all()
    result = {}
    for row in rows:
        result[row.key] = row.value
    return result


def _upsert_setting(db: Session, key: str, value: Any) -> None:
    """Insert or update a single settings row."""
    row = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if row:
        row.value = value
    else:
        db.add(SiteSetting(key=key, value=value))


def seed_default_settings(db: Session) -> None:
    """
    Called at startup — only writes rows that don't already exist.
    Existing customisations are never overwritten.
    """
    for key, value in DEFAULT_SETTINGS.items():
        existing = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if not existing:
            db.add(SiteSetting(key=key, value=value))
    db.commit()


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/public")
async def get_public_settings(db: Session = Depends(get_db)):
    """
    Returns the public-safe subset of settings.
    No authentication required — used by frontend public pages.
    """
    all_settings = _get_all_settings(db)
    # Fall back to defaults for any key not yet in the DB
    merged = {k: DEFAULT_SETTINGS.get(k, {}) for k in PUBLIC_KEYS}
    for k in PUBLIC_KEYS:
        if k in all_settings:
            merged[k] = all_settings[k]
    return merged


@router.get("")
async def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Returns all settings (admin only).
    """
    all_settings = _get_all_settings(db)
    # Merge with defaults so every key is always present
    merged = dict(DEFAULT_SETTINGS)
    merged.update(all_settings)
    return merged


@router.put("")
async def update_settings(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Saves the provided settings keys (admin only).
    Only the keys present in the payload are updated; others are untouched.
    """
    for key, value in payload.items():
        _upsert_setting(db, key, value)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save settings: {str(e)}",
        )
    return {"success": True, "message": "Settings saved successfully."}
