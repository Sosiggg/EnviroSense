from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    # password attemp limitation
    failed_login_attempts = Column(Integer, default=0)
    last_failed_login = Column(DateTime, nullable=True)
    account_locked_until = Column(DateTime, nullable=True)

    # password inputs
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)

    # user to data recieve
    sensor_data = relationship("SensorData", back_populates="user")