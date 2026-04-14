from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./database.db"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:5174"]
    ADMIN_EMAIL: str = "gerente@loja.com"
    ADMIN_PASSWORD: str = "senha123"
    JWT_SECRET: str = "troque-por-uma-chave-segura-em-producao"
    JWT_EXPIRE_MINUTES: int = 480

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
