from dataclasses import dataclass
from playwright.sync_api import Playwright, Page, Browser
from typing import Tuple
from .types import ScraperConfig


import logging
logger = logging.getLogger(__name__)


class BrowserService:
    """Gère l'initialisation et la configuration du navigateur"""
    
    def __init__(self, config: ScraperConfig):
        self.config = config
    
    def init_browser(self, pw: Playwright, url: str) -> Tuple[Page, Browser]:
        """
        Initialise le navigateur et retourne une page configurée
        
        Args:
            pw: Instance Playwright
            url: URL à charger
            
        Returns:
            Tuple (Page, Browser)
        """
        try:
            browser = pw.chromium.launch(headless=self.config.HEADLESS)
            context = browser.new_context(
                viewport={
                    "width": self.config.VIEWPORT_WIDTH,
                    "height": self.config.VIEWPORT_HEIGHT
                }
            )
            page = context.new_page()
            page.set_default_timeout(self.config.TIMEOUT)
            page.goto(url)
            
            logger.info(f"Browser initialized for URL: {url}")
            return page, browser
            
        except Exception as e:
            logger.error(f"Failed to initialize browser: {e}")
            raise
    
    def remove_cookie_banner(self, page: Page) -> Page:
        """Supprime la bannière de cookies si présente"""
        try:
            cookie_button = page.locator("button:has-text('Refuser tous les cookies')")
            if cookie_button.is_visible(timeout=3000):
                cookie_button.click()
                logger.info("Cookie banner removed")
        except Exception as e:
            logger.debug(f"No cookie banner found or error: {e}")
        
        return page

