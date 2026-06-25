from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_URL = "sqlite:///./zoom.db"

eng = create_engine(DB_URL, connect_args={"check_same_thread": False})
Sess = sessionmaker(bind=eng, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = Sess()
    try:
        yield db
    finally:
        db.close()
