"""
__init__.py

Description: Database initialization module with super admin creation
Author: AI Services Platform Team
Date: 2025
"""

import logging
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal, engine, Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_tables() -> None:
    """Create all database tables"""
    try:
        # Import all models so SQLAlchemy metadata is populated before create_all
        from app.models.user import User  # noqa: F401
        from app.models.contact import Contact  # noqa: F401
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Error creating database tables: {e}")
        raise


def _hash_password(plain: str) -> str:
    """Hash a password with bcrypt directly (no passlib)."""
    import bcrypt
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(plain: str, hashed: str) -> bool:
    """Verify a password against a bcrypt hash."""
    import bcrypt
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_super_admin() -> None:
    """
    Ensure the built-in admin account exists with username 'admin'
    and an initial password of 'password' (bcrypt-hashed).
    If the row already exists but has no password_hash, backfill it.
    """
    try:
        from app.models.user import User, UserRole

        ADMIN_USERNAME = "admin@admin.com"
        INITIAL_PASSWORD = "password"

        db = SessionLocal()

        admin = db.query(User).filter(User.email == ADMIN_USERNAME).first()

        if admin:
            if not admin.password_hash:
                admin.password_hash = _hash_password(INITIAL_PASSWORD)
                db.commit()
                logger.info("✅ Admin password hash backfilled")
            else:
                logger.info("✅ Admin account already exists")
            db.close()
            return

        admin = User(
            email=ADMIN_USERNAME,
            full_name="Administrator",
            role=UserRole.SUPER_ADMIN,
            password_hash=_hash_password(INITIAL_PASSWORD),
            oauth_provider=None,
            oauth_id=None,
            is_active=True,
            email_verified=True,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        logger.info(f"✅ Admin account created  (username: '{ADMIN_USERNAME}', password: '{INITIAL_PASSWORD}')")
        logger.info("⚠️  Change the password via Admin → Settings → Security")
        db.close()

    except Exception as e:
        logger.error(f"❌ Error creating admin account: {e}")
        if 'db' in locals():
            db.rollback()
            db.close()


def init_db() -> None:
    """Initialize database with tables and super admin"""
    logger.info("🚀 Starting database initialization...")
    
    # Create tables
    create_tables()
    
    # Create super admin
    logger.info("🔧 Creating super admin user...")
    create_super_admin()
    
    logger.info("🎉 Database initialization completed!")


# Export the main function
__all__ = ["init_db", "create_super_admin", "create_tables"]