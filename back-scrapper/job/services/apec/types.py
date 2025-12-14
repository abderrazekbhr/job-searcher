
from dataclasses import dataclass


@dataclass
class ScraperConfig:
    BASE_URI: str = "https://www.apec.fr"
    VIEWPORT_WIDTH: int = 1080
    VIEWPORT_HEIGHT: int = 720
    HEADLESS: bool = True
    TIMEOUT: int = 30000
    WAIT_AFTER_CLICK: float = 1.0