from playwright.sync_api import Page
from time import sleep
from .types import ScraperConfig
import logging

logger = logging.getLogger(__name__)


class FilterService:
    """Gère l'application des filtres de recherche"""
    
    def __init__(self, config: ScraperConfig):
        self.config = config
    
    def set_text_filter(self, page: Page, selector: str, value: str) -> None:
        """Définit un filtre de type texte"""
        try:
            page.locator(selector).fill(value)
            logger.debug(f"Filter set: {selector} = {value}")
        except Exception as e:
            logger.error(f"Failed to set filter {selector}: {e}")
            raise
    
    def set_select_filter(self, page: Page, selector: str, label: str) -> None:
        """Définit un filtre de type select"""
        try:
            page.locator(selector).select_option(label=label)
            logger.debug(f"Select filter set: {selector} = {label}")
        except Exception as e:
            logger.error(f"Failed to set select filter {selector}: {e}")
            raise
    
    def apply_filters(
        self, 
        page: Page,
        keywords: str = "Développeur Full Stack",
        contract_type: str = "CDI",
        experience_level: str = "Débutant"
    ) -> None:
        """
        Applique tous les filtres de recherche
        
        Args:
            page: Page Playwright
            keywords: Mots-clés de recherche
            contract_type: Type de contrat
            experience_level: Niveau d'expérience
        """
        try:
            self.set_text_filter(page, "input[name='keywords']", keywords)
            self.set_select_filter(page, "select[name='typeContrat']", contract_type)
            self.set_select_filter(page, "select[name='niveauExperience']", experience_level)
            
            search_button = page.locator("button:has-text('Rechercher')")
            search_button.click()
            
            sleep(self.config.WAIT_AFTER_CLICK)
            logger.info(f"Filters applied: {keywords}, {contract_type}, {experience_level}")
            
        except Exception as e:
            logger.error(f"Failed to apply filters: {e}")
            raise
