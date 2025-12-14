from playwright.sync_api import sync_playwright
from typing import List, Dict, Optional
from .types import ScraperConfig
from .filter import FilterService
from .browser import BrowserService
from .service import ScraperService  
import logging
logger = logging.getLogger(__name__)


class ApecJobScraper:
    """Orchestrateur principal du scraping APEC"""
    
    def __init__(self,  config: Optional[ScraperConfig] = None):
        self.config = config or ScraperConfig()
        self.browser_service = BrowserService(self.config)
        self.filter_service = FilterService(self.config)
        self.scraper_service = ScraperService(self.config )
    
    def search_jobs(
        self,
        keywords: str = "Développeur Full Stack",
        contract_type: str = "CDI",
        experience_level: str = "Débutant",
        max_jobs: Optional[int] = None
    ) -> List[Dict]:
        """
        Recherche et extrait les offres d'emploi depuis APEC
        
        Args:
            keywords: Mots-clés de recherche
            contract_type: Type de contrat
            experience_level: Niveau d'expérience
            max_jobs: Nombre maximum d'offres à extraire (None = toutes)
            
        Returns:
            Liste des offres d'emploi extraites
        """
        logger.info(f"Starting APEC job search: {keywords}")
        
        with sync_playwright() as pw:
            try:
                # Initialiser le navigateur
                search_url = f"{self.config.BASE_URI}/candidat/recherche-emploi.html/emploi/recherche-avancee"
                page, browser = self.browser_service.init_browser(pw, search_url)
                
                # Supprimer la bannière de cookies
                page = self.browser_service.remove_cookie_banner(page)
                
                # Appliquer les filtres
                self.filter_service.apply_filters(
                    page,
                    keywords=keywords,
                    contract_type=contract_type,
                    experience_level=experience_level
                )
                
                # Extraire les URLs des offres
                job_urls = self.scraper_service.extract_job_urls(page)
                
                # Limiter le nombre d'offres si demandé
                if max_jobs:
                    job_urls = job_urls[:max_jobs]
                
                # Extraire les détails de chaque offre
                job_data = self.scraper_service.extract_job_details(page, job_urls)
                
                logger.info(f"Successfully extracted {len(job_data)} jobs")
                return job_data
                
            except Exception as e:
                logger.error(f"Job search failed: {e}")
                raise
            
            finally:
                try:
                    browser.close()
                    logger.info("Browser closed")
                except Exception:
                    pass
