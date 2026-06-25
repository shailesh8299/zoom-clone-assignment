from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from db import get_db
from models import Mtg, Part, new_id
from schema import MtgCreate, MtgOut, JoinReq, PartOut

r = APIRouter(prefix="/meetings", tags=["meetings"])

BASE_URL = "http://localhost:3000"

def make_link(mtg_id: str) -> str:
    return f"{BASE_URL}/meet/{mtg_id}"

@r.post("/", response_model=MtgOut)
def create_mtg(body: MtgCreate, db: Session = Depends(get_db)):
    m = Mtg(
        title=body.title,
        desc=body.desc or "",
        sched_at=body.sched_at,
        dur_min=body.dur_min,
    )
    db.add(m)
    db.flush()          # ← this assigns the ID before we use it
    m.link = f"http://localhost:3000/meet/{m.id}"
    db.commit()
    db.refresh(m)
    return m

@r.get("/", response_model=list[MtgOut])
def list_mtgs(db: Session = Depends(get_db)):
    return db.query(Mtg).order_by(Mtg.created.desc()).all()

@r.get("/upcoming", response_model=list[MtgOut])
def upcoming(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    return (
        db.query(Mtg)
        .filter(Mtg.sched_at != None, Mtg.sched_at > now)
        .order_by(Mtg.sched_at)
        .all()
    )

@r.get("/recent", response_model=list[MtgOut])
def recent(db: Session = Depends(get_db)):
    return (
        db.query(Mtg)
        .filter(Mtg.sched_at == None)
        .order_by(Mtg.created.desc())
        .limit(10)
        .all()
    )

@r.get("/{rid}", response_model=MtgOut)
def get_mtg(rid: str, db: Session = Depends(get_db)):
    m = db.query(Mtg).filter(Mtg.id == rid).first()
    if not m:
        raise HTTPException(404, "Meeting not found")
    return m

@r.post("/{rid}/join", response_model=PartOut)
def join_mtg(rid: str, body: JoinReq, db: Session = Depends(get_db)):
    m = db.query(Mtg).filter(Mtg.id == rid).first()
    if not m:
        raise HTTPException(404, "Meeting not found")
    p = Part(mtg_id=rid, name=body.name, is_host=False)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@r.get("/{rid}/participants", response_model=list[PartOut])
def get_parts(rid: str, db: Session = Depends(get_db)):
    return db.query(Part).filter(Part.mtg_id == rid).all()
