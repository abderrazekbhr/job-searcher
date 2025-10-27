from time import sleep
from typing import List
from playwright.sync_api import sync_playwright,Playwright
from JobSearch.models import Job,Entreprise
from config.generative_ia import generate
from JobSearch.services.shared import defined_job_titles
BASE_URI="https://www.apec.fr"


def init_scrapper(pw: Playwright, uri: str) -> str:
    browser = pw.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1080, "height": 720})
    page = context.new_page()
    # go to url
    page.goto(uri)
    # get HTML
    return (page, browser)

def set_filter(page:Playwright,selector:str,value:str):
    page.locator(selector).fill(value)
    
def remove_cookie_banner(page:Playwright):
    if page.locator("button:has-text('Refuser tous les cookies')").is_visible():
        page.locator("button:has-text('Refuser tous les cookies')").click()
    return page

def apply_filters(page:Playwright):
    page=remove_cookie_banner(page)
    jobs=defined_job_titles()
    set_filter(page,"input[name='keywords']",jobs['fr'][0])
    page.locator("select[name='typeContrat']").select_option(label="CDI")
    page.locator("select[name='niveauExperience']").select_option(label="Débutant")
    page.locator("select[name='dateParution']").select_option(label="Dernières 24h")
    page.locator("button:has-text('Rechercher')").click()
    sleep(1)
    return extract_job_uri_apec(page)

    
    

def extract_job_uri_apec(page: Playwright) -> dict:
    links = page.locator('a[href^="/candidat/recherche-emploi.html/emploi/detail-offre/"]')
    uri_jobs:List[str]=[links.nth(i).get_attribute('href') for i in range(links.count())]
    while pass_next_page(page):
        links = page.locator('a[href^="/candidat/recherche-emploi.html/emploi/detail-offre/"]')
        uri_jobs.extend([links.nth(i).get_attribute('href') for i in range(links.count())])

    all_posts_data=extract_job_data(page,uri_jobs)
    
    return uri_jobs


def extract_job_data(page: Playwright,jobs_uris:List[str]):
    
    for uri in jobs_uris:
        page.goto(
            BASE_URI+uri
        )
        list_detail_offre=page.eval_on_selector_all(
        ".details-offer-list li",
        "elements => elements.map(el => el.textContent.trim())"
    )
        description_div=page.locator(".details-post").all()
        job_object={
            "title":page.locator("h1").text_content(),    
            "experience_level":description_div[2].text_content(),
            "published_date":page.locator(".date-offre.mb-10").text_content(),
            "enterprise":list_detail_offre[0],
            "platform":"APEC",
            "location":list_detail_offre[2],
            "contract_type":list_detail_offre[1],
            "salary":description_div[0].text_content(),
            "link":BASE_URI+uri,
            "skill":extract_job_hard_skills,
            "other_details":description_div[-1].text_content()
        }
        
        print(job_object)
                
def extract_job_hard_skills(description:str)-> list[str]:
    generate(
    """
        based on the this job description i need that you try to give the soft and hard skills required
    """
    )
    
    pass
    


def pass_next_page(page: Playwright):
    if page.locator("a.page-link", has_text="Suiv.").is_visible():
        page.locator("a.page-link", has_text="Suiv.").click()
        return True
    return False


def apec_job_search():
    with sync_playwright() as pw:
        page, browser = init_scrapper(pw,f"{BASE_URI}/candidat/recherche-emploi.html/emploi/recherche-avancee")
        content=apply_filters(page)
        browser.close()
        return content



