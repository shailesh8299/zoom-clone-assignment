import os
from db import eng, Sess, Base
from models import Mtg, Part
from datetime import datetime, timedelta

Base.metadata.create_all(bind=eng)

# Uses Vercel URL on Render; uses localhost only while testing locally
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://FRONTEND_URL"
).rstrip("/")

db = Sess()

meetings = [
    Mtg(
        id="ABC12345",
        title="Weekly Standup",
        desc="Team sync",
        link=f"{FRONTEND_URL}/meet/ABC12345",
        sched_at=datetime.utcnow() + timedelta(hours=2),
        dur_min=30,
    ),
    Mtg(
        id="XYZ67890",
        title="Product Review",
        desc="Q3 roadmap review",
        link=f"{FRONTEND_URL}/meet/XYZ67890",
        sched_at=datetime.utcnow() + timedelta(days=1),
        dur_min=60,
    ),
    Mtg(
        id="INSTANT1",
        title="Quick Sync",
        desc="",
        link=f"{FRONTEND_URL}/meet/INSTANT1",
        sched_at=None,
        dur_min=60,
    ),
    Mtg(
        id="INSTANT2",
        title="Design Review",
        desc="",
        link=f"{FRONTEND_URL}/meet/INSTANT2",
        sched_at=None,
        dur_min=45,
    ),
]

for m in meetings:
    db.merge(m)

parts = [
    Part(id=1, mtg_id="ABC12345", name="Alex Kim", is_host=True),
    Part(id=2, mtg_id="ABC12345", name="Sarah Lee", is_host=False),
    Part(id=3, mtg_id="INSTANT1", name="Default User", is_host=True),
]

for p in parts:
    db.merge(p)

db.commit()
db.close()

print(f"Seeded successfully. Frontend URL: {FRONTEND_URL}")