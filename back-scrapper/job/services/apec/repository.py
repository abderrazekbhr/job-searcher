from datetime import datetime
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)




class DatabaseService:
    """Gère les opérations de base de données"""
    
    @staticmethod
    def parse_date(date_str: str) -> datetime:
        """
        Parse et valide une date depuis le format APEC
        
        Args:
            date_str: String contenant la date
            
        Returns:
            datetime object
        """
        try:
            if "Publiée le " in date_str:
                date_part = date_str.split("Publiée le ")[-1].strip()
                return datetime.strptime(date_part, '%d/%m/%y')
            return timezone.now()
        except Exception as e:
            logger.error(f"Failed to parse date '{date_str}': {e}")
            return timezone.now()
    
    @staticmethod
    def get_or_create_enterprise(name: str, location: str):
        """
        Récupère ou crée une entreprise
        
        Args:
            name: Nom de l'entreprise
            location: Localisation
            
        Returns:
            Instance Entreprise
        """
        from job.models import Entreprise  # Import local
        
        try:
            enterprise, created = Entreprise.objects.get_or_create(
                name=name,
                defaults={'location': location}
            )
            
            if created:
                logger.info(f"Created new enterprise: {name}")
            else:
                logger.debug(f"Retrieved existing enterprise: {name}")
            
            return enterprise
            
        except Exception as e:
            logger.error(f"Failed to get/create enterprise '{name}': {e}")
            raise

