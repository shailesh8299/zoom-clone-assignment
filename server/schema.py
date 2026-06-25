from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MtgCreate(BaseModel):
    title: str
    desc: Optional[str] = ""
    sched_at: Optional[datetime] = None
    dur_min: Optional[int] = 60

class MtgOut(BaseModel):
    id: str
    title: str
    desc: str
    sched_at: Optional[datetime]
    dur_min: int
    link: str
    active: bool
    created: datetime

    class Config:
        from_attributes = True

class JoinReq(BaseModel):
    name: str

class PartOut(BaseModel):
    id: int
    name: str
    joined: datetime
    is_host: bool

    class Config:
        from_attributes = True
