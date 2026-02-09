from playwright.sync_api import Page
from typing import List, Dict
from time import sleep
from .types import ScraperConfig
from job.services.shared import llm 
import logging

logger = logging.getLogger(__name__)


class ScraperService:
    """Gère l'extraction des données des offres d'emploi"""
    
    def __init__(self, config: ScraperConfig):
        self.config = config
    
    def extract_job_urls(self, page: Page) -> List[str]:
        """
        Extrait toutes les URLs des offres d'emploi avec pagination
        
        Args:
            page: Page Playwright
            
        Returns:
            Liste des URLs des offres
        """
        uri_jobs = []
        
        try:
            while True:
                links = page.locator('a[href^="/candidat/recherche-emploi.html/emploi/detail-offre/"]')
                count = links.count()
                
                if count == 0:
                    logger.warning("No job links found on current page")
                    break
                
                for i in range(count):
                    url = links.nth(i).get_attribute('href')
                    if url and url not in uri_jobs:
                        uri_jobs.append(url)
                
                logger.info(f"Extracted {count} job URLs from current page")
                
                if not self._go_to_next_page(page):
                    break
            
            logger.info(f"Total job URLs extracted: {len(uri_jobs)}")
            return uri_jobs
            
        except Exception as e:
            logger.error(f"Failed to extract job URLs: {e}")
            raise
    
    def _go_to_next_page(self, page: Page) -> bool:
        """Passe à la page suivante si disponible"""
        try:
            next_button = page.locator("a.page-link", has_text="Suiv.")
            if next_button.is_visible(timeout=2000):
                next_button.click()
                sleep(self.config.WAIT_AFTER_CLICK)
                logger.debug("Navigated to next page")
                return True
            return False
        except Exception:
            return False
    
    def extract_job_details(self, page: Page, job_urls: List[str]) -> List[Dict]:
        """
        Extrait les détails de chaque offre d'emploi
        
        Args:
            page: Page Playwright
            job_urls: Liste des URLs à extraire
            
        Returns:
            Liste des données d'offres d'emploi
        """
        results = []
        
        for idx, uri in enumerate(job_urls, 1):
            try:
                full_url = f"{self.config.BASE_URI}{uri}"
                page.goto(full_url)
                
                job_data = self._parse_job_page(page, uri)
                results.append(job_data)
                
                logger.info(f"Extracted job {idx}/{len(job_urls)}: {job_data['title']}")
                
            except Exception as e:
                logger.error(f"Failed to extract job from {uri}: {e}")
                continue
        
        return results
    
    def _parse_job_page(self, page: Page, uri: str) -> Dict:
        """Parse une page d'offre d'emploi individuelle"""
        
        # Extraire les détails de l'offre
        list_detail_offre = page.eval_on_selector_all(
            ".details-offer-list li",
            "elements => elements.map(el => el.textContent.trim())"
        )
        
        description_divs = page.locator(".details-post").all()
        
        # Extraire le texte de la description complète
        job_description = (
            description_divs[-1].text_content().strip() 
            if len(description_divs) > 0 
            else ""
        )
        
        # Extraire les compétences via IA
        skills = self._extract_skills_safely(job_description)
        
        return {
            "title": self._safe_extract(page.locator("h1").text_content),
            "experience_level": self._safe_get_text(description_divs, 2),
            "published_date": self._safe_extract(
                page.locator(".date-offre.mb-10").text_content
            ).replace("Publié le ", "").strip(),
            "enterprise": self._safe_list_get(list_detail_offre, 0),
            "platform": "APEC",
            "location": self._safe_list_get(list_detail_offre, 2),
            "contract_type": self._safe_list_get(list_detail_offre, 1),
            "salary": self._safe_get_text(description_divs, 0),
            "link": f"{self.config.BASE_URI}{uri}",
            "skills": skills,
            "description": job_description
        }
    
    def _extract_skills_safely(self, description: str) -> List[str]:
        """Extrait les compétences avec gestion d'erreur"""
        try:
            if not description or description == "Not Specified":
                return []
            PROMPT_NAME="extract_skills"
            result = llm(prompt_name=PROMPT_NAME,description=description)
            return result.get("skills", []) if isinstance(result, dict) else []
            
        except Exception as e:
            logger.error(f"Failed to extract skills: {e}")
            return []
    
    @staticmethod
    def _safe_extract(text_func) -> str:
        """Extraction sécurisée de texte"""
        try:
            return text_func().strip()
        except Exception:
            return "Not Specified"
    
    @staticmethod
    def _safe_get_text(elements: List, index: int) -> str:
        """Récupération sécurisée de texte depuis une liste"""
        try:
            return elements[index].text_content().strip() if len(elements) > index else "Not Specified"
        except Exception:
            return "Not Specified"
    
    @staticmethod
    def _safe_list_get(lst: List, index: int) -> str:
        """Récupération sécurisée depuis une liste"""
        try:
            return lst[index] if len(lst) > index else "Not Specified"
        except Exception:
            return "Not Specified"

