"""
Seed script for Playbooks (Resource) and Playbook Categories (SiteSetting)
"""
import logging
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.resource import Resource
from app.models.site_settings import SiteSetting

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SEED_CATEGORIES = [
    {"id": "launch", "name": "Launch"},
    {"id": "ai-genie", "name": "AI Genie Usage"},
    {"id": "legal", "name": "Legal & Compliance"},
    {"id": "sales", "name": "Sales & Marketing"},
    {"id": "money", "name": "Money & Payments"},
    {"id": "templates", "name": "Templates"},
]

SEED_PLAYBOOKS = [
    {
        "title": "One-Person Company Launch Checklist & Playbook",
        "description": "Step-by-step roadmap to setting up legal structure, branding, offer suite, and launch campaign in 7 days.",
        "category": "launch",
        "content_type": "checklist",
        "is_featured": True,
        "is_public": True,
        "read_time_minutes": 15,
        "file_url": "/downloads/opc-launch-checklist.pdf",
        "difficulty": "Beginner",
        "duration": "15 min read",
        "author": "OPC Genie Team",
        "tags": ["Launch", "Checklist", "Solo Founder"],
        "rating": 4.9,
        "downloads": 1240,
        "is_published": True,
        "nav_order": 1,
    },
    {
        "title": "Mastering Your AI Genie: Prompting & Automation Playbook",
        "description": "How to train your AI Genie to generate high-converting landing pages, draft client proposals, and automate client replies.",
        "category": "ai-genie",
        "content_type": "guide",
        "is_featured": False,
        "is_public": True,
        "read_time_minutes": 25,
        "file_url": None,
        "difficulty": "Intermediate",
        "duration": "25 min read",
        "author": "OPC Genie AI Lab",
        "tags": ["AI Genie", "Automation", "Workflows"],
        "rating": 4.8,
        "downloads": 890,
        "is_published": True,
        "nav_order": 2,
    },
    {
        "title": "Solo Founder Standard Client Agreement & Privacy Template",
        "description": "Standard service agreement terms, limitation of liability, and privacy policy templates customizable for solo consultants and creators.",
        "category": "legal",
        "content_type": "template",
        "is_featured": False,
        "is_public": True,
        "read_time_minutes": 10,
        "file_url": "/downloads/solo-founder-legal-pack.docx",
        "difficulty": "Beginner",
        "duration": "10 min read",
        "author": "Legal Advisory Team",
        "tags": ["Legal", "Contracts", "Templates"],
        "rating": 4.7,
        "downloads": 1520,
        "is_published": True,
        "nav_order": 3,
    },
    {
        "title": "Outbound Sales & Social Proof Engine for Solo Founders",
        "description": "A repeatable playbook for acquiring your first 10 high-paying clients through cold outreach, LinkedIn distribution, and testimonials.",
        "category": "sales",
        "content_type": "guide",
        "is_featured": False,
        "is_public": True,
        "read_time_minutes": 30,
        "file_url": None,
        "difficulty": "Intermediate",
        "duration": "30 min read",
        "author": "Growth Advisory",
        "tags": ["Sales", "Outreach", "Client Acquisition"],
        "rating": 4.9,
        "downloads": 2100,
        "is_published": True,
        "nav_order": 4,
    },
    {
        "title": "Pricing & Invoicing Playbook for Solo Service Businesses",
        "description": "How to package retainers, set up payment gateways (Razorpay, Stripe, PayPal), and handle cross-border payments without friction.",
        "category": "money",
        "content_type": "guide",
        "is_featured": False,
        "is_public": True,
        "read_time_minutes": 20,
        "file_url": None,
        "difficulty": "Intermediate",
        "duration": "20 min read",
        "author": "Finance Advisory",
        "tags": ["Pricing", "Invoicing", "Payments"],
        "rating": 4.8,
        "downloads": 970,
        "is_published": True,
        "nav_order": 5,
    },
    {
        "title": "High-Converting Offer & Proposal Template Bundle",
        "description": "Plug-and-play pitch decks, one-page client proposals, and scope of work templates designed to close deals on the spot.",
        "category": "templates",
        "content_type": "download",
        "is_featured": False,
        "is_public": True,
        "read_time_minutes": 5,
        "file_url": "/downloads/offer-proposal-templates.zip",
        "difficulty": "Beginner",
        "duration": "5 min setup",
        "author": "OPC Studio",
        "tags": ["Proposals", "Decks", "Templates"],
        "rating": 5.0,
        "downloads": 3400,
        "is_published": True,
        "nav_order": 6,
    },
]


def seed_playbooks():
    """Ensure database tables are up to date and seed categories & playbooks."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # 1. Upsert playbook_categories in site_settings
        cat_setting = db.query(SiteSetting).filter(SiteSetting.key == "playbook_categories").first()
        if not cat_setting:
            cat_setting = SiteSetting(key="playbook_categories", value=SEED_CATEGORIES)
            db.add(cat_setting)
            logger.info("Inserted playbook_categories in site_settings")
        else:
            cat_setting.value = SEED_CATEGORIES
            logger.info("Updated playbook_categories in site_settings")

        db.commit()

        # 2. Seed placeholder Resource rows if table is empty or missing these titles
        for item in SEED_PLAYBOOKS:
            existing = db.query(Resource).filter(Resource.title == item["title"]).first()
            if not existing:
                db.add(Resource(**item))
                logger.info(f"Seeded Resource: {item['title']}")
            else:
                for k, v in item.items():
                    setattr(existing, k, v)
                logger.info(f"Updated Resource: {item['title']}")

        db.commit()
        logger.info("Playbook seeding complete!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding playbooks: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_playbooks()
