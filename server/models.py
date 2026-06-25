import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

def new_id():
    return str(uuid.uuid4())[:8].upper()

class Mtg(Base):
    __tablename__ = "meetings"

    id       = Column(String, primary_key=True, default=new_id)
    title    = Column(String(120), nullable=False)
    host_id  = Column(String, default="default_user")
    desc     = Column(Text, default="")
    sched_at = Column(DateTime, nullable=True)
    dur_min  = Column(Integer, default=60)
    link     = Column(String, unique=True)
    active   = Column(Boolean, default=True)
    created  = Column(DateTime, default=datetime.utcnow)

    parts = relationship("Part", back_populates="mtg", cascade="all, delete")

class Part(Base):
    __tablename__ = "participants"

    id       = Column(Integer, primary_key=True, autoincrement=True)
    mtg_id   = Column(String, ForeignKey("meetings.id"), nullable=False)
    name     = Column(String(80), nullable=False)
    joined   = Column(DateTime, default=datetime.utcnow)
    is_host  = Column(Boolean, default=False)

    mtg = relationship("Mtg", back_populates="parts")
