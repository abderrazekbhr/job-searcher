import scrapy
from config.generative_ia import generate
from datetime import datetime
from job.models import Entreprise
from django.shortcuts import get_object_or_404

BASE_URI="https://www.apec.fr"


class ApecJobSpider(scrapy.Spider):
    name = "apec_jobs"

    # Constructor: accept a list of URLs to scrape
    def __init__(self, urls: list[str], *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_urls = urls
        self.results = []

    # Standard Scrapy method to generate initial requests
    def start_requests(self):
        print("Starting APEC job scraping...")
        for url in self.start_urls:
            print(f"Queuing URL: {url}")
            # Each URL triggers the parse method when the response is received
            yield scrapy.Request(url=url, callback=self.parse)
            
    

    # TODO
    def __validate_date(self,date:str)->datetime:
        start=date.find("Publiée le ")
        if start!=-1:
            date=date[start+len(date):]
            converted_date = datetime.strptime(date, '%d/%m/%y')
            return converted_date
        else:
            datetime.today().strftime('%Y-%m-%d') 
        
    # TODO
    def __validate_entreprise(self,entreprise:str,location:str)->Entreprise:
        try:
            data=Entreprise.objects.get(name=entreprise)
            return data            
        except:
            new_entreprise=Entreprise(
                name=entreprise,
                location=location
                
            )
        

    # TODO
    def _generate_skills(self,details:str):
        pass
    
    # TODO
    
    
    
    # Main parsing method for each response
    def parse(self, response):
        """
        Parse a job detail page from APEC and extract key information.
        """
        print(f"Scraping URL: {response.url}")
        print(response.css("h1::text").get(defaultq="").strip())
        # Extract job details from the "details-offer-list" section
        list_detail_offre = response.css(".details-offer-list li::text").getall()
        list_detail_offre = [item.strip() for item in list_detail_offre]

        # Extract content from the description section
        description_div = response.css(".details-post *::text").getall()
        description_div = [item.strip() for item in description_div if item.strip()]

        # Construct a job object with relevant fields
        job_object = {
            "title": response.css("h1::text").get(default="").strip(),
            "experience_level": response.css(".details-post > div:nth-child(3)::text").get(default="").strip(),
            "published_date": self.__validate_date(response.css(".date-offre.mb-10::text").get(default="").strip()),
            "enterprise": list_detail_offre[0] if len(list_detail_offre) > 0 else None,
            "platform": "APEC",
            "contract_type": list_detail_offre[1] if len(list_detail_offre) > 1 else None,
            "salary": description_div[0] if len(description_div) > 0 else None,
            "link": response.url,  # Use the current page URL
            "other_details": description_div[-1] if description_div else None,
            # "skills": ApecJobSpider.extract_job_hard_skills(" ".join(description_div))
        }

        # Append the job to the results list
        self.results.append(job_object)

    def extract_job_hard_skills(self,description:str)-> list[str]:
        generate(
            f"""Based on the following job description, extract the required soft skills and hard skills.
        Return the result strictly in the following JSON structure — no explanations, no extra text:
        {
        "soft_skills": [
            "list of soft skills here"
        ],
        "hard_skills": [
            "list of hard skills here"
        ]
        }
        Job description: {description}
            """
            )