from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./optirank.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class KeywordResult(Base):
    __tablename__ = "keyword_results"
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, index=True)
    data = Column(JSON)  # Stores related keywords, questions, etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class GeneratedContent(Base):
    __tablename__ = "generated_content"
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, index=True)
    content = Column(Text)
    meta_title = Column(String)
    meta_description = Column(Text)
    seo_score = Column(Integer)
    data = Column(JSON) # Stores tags, structure, etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SEOReport(Base):
    __tablename__ = "seo_reports"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    overall_score = Column(Integer)
    data = Column(JSON) # Detailed audit results
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
