import logging

from app.core.database import Base   # all models register on this Base
from app.db.session import engine, SessionLocal

logger = logging.getLogger(__name__)


def init_db() -> None:
    """Initialize the database by creating all tables and seeding defaults."""
    # ── 1. Import every model so SQLAlchemy registers them before create_all ──
    from app.models.user import User          # noqa: F401
    from app.models.contact import Contact    # noqa: F401
    from app.models.site_settings import SiteSetting  # noqa: F401
    from app.models.course import Course      # noqa: F401

    # ── 2. Create tables ──
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")

    # ── 3. Seed default site settings (only inserts missing rows) ──
    try:
        from app.api.routes.settings_routes import seed_default_settings
        db = SessionLocal()
        try:
            seed_default_settings(db)
            logger.info("Site settings seeded successfully")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error seeding site settings: {str(e)}")
        # Non-fatal — tables exist, seeding can be retried