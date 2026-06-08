import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillGraph AI"
    API_V1_STR: str = "/api"
    # Ensure your local postgres credentials match this or are set in your environment variables
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_Ama3EgNLTv1P@ep-jolly-rice-aowwgwmm.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")

    class Config:
        case_sensitive = True

settings = Settings()