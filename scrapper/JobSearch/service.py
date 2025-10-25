from time import sleep
from playwright.sync_api import sync_playwright,Playwright
from config.generative_ia import generate
from pypdf import PdfReader

def load_cv_from_file(file_path: str) -> str:
    load_pdf= PdfReader(file_path)
    content=""
    for i in range(len(load_pdf.pages)):
        page = load_pdf.pages[i].extract_text()
        content += page + "\n"
    return content

"""
Generate relevant job titles from CV content
"""
def defined_job_titles():
    cv_content = load_cv_from_file("ressources/CV_Abderrazek BELHAJ RHOUMA.pdf")
    generated = generate(prompt = f"""
Analyze the following CV content and identify 10 relevant job titles based on the skills, experience, and career focus described. Provide a diverse set of titles that best match the job roles and expertise. Include both common and specialized roles that may apply.

Then, translate these job titles into French, ensuring the job titles are still contextually accurate in the translated language.

Finally, use skills and core competencies that are mentioned throughout the CV (e.g., technical skills, management abilities, industry-specific knowledge) to produce the following output.

**Strict Format:**
Job Titles in English: [title1, title2, title3, title4, title5, title6, title7, title8, title9, title10]***Job Titles in French: [title1_fr, title2_fr, title3_fr, title4_fr, title5_fr, title6_fr, title7_fr, title8_fr, title9_fr, title10_fr]

**Response Format Constraints:**
- Do **not** include any other text, explanations, or content other than the job titles in the specified format.
- Ensure that job titles are listed as a single line within the brackets, separated by commas, **with no extra line breaks or numbering**.
- Do **not** add any bullet points or extra symbols.
- Follow the **exact format** provided below, with no deviations.
- Ensure the job titles english are in english and the french ones in french.
- Ensure the French translations are accurate and contextually appropriate for job titles.
- Ensure there are exactly 10 job titles in each language.
- Use "***" to separate the English and French lists.
- Adhere strictly to the format to facilitate automated parsing.



Input (CV Content):
{cv_content}
Expected Output:
"
Job Titles in English: [english_job_title1, english_job_title2, english_job_title3, english_job_title4, english_job_title5, english_job_title6, english_job_title7, english_job_title8, english_job_title9, english_job_title10]***Job Titles in French: [french_job_title1, french_job_title2, french_job_title3, french_job_title4, french_job_title5, french_job_title6, french_job_title7, french_job_title8, french_job_title9, french_job_title10]
"
    """) 
    format_generated=generated.split("***")
    print(format_generated)
    job_titles_en=format_generated[0].replace("Job Titles in English: ","").strip("[]").split(",")
    job_titles_fr=format_generated[1].replace("Job Titles in French: ","").strip("[]").split(",")
    
    
    job_titles_en=[title.strip() for title in job_titles_en]
    job_titles_fr=[title.strip() for title in job_titles_fr]
    
    return {
        "en":job_titles_en,
        "fr":job_titles_fr
    }






def fetch_page_content(pw: Playwright, uri: str) -> str:
    browser = pw.chromium.launch(headless=False)
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
    uri_jobs=[links.nth(i).get_attribute('href') for i in range(links.count())]
    while pass_next_page(page):
        links = page.locator('a[href^="/candidat/recherche-emploi.html/emploi/detail-offre/"]')
        uri_jobs.extend([links.nth(i).get_attribute('href') for i in range(links.count())])
    return uri_jobs

def pass_next_page(page: Playwright):
    
    if page.locator("a.page-link", has_text="Suiv.").is_visible():
        print(f"""page :{
            page.locator("a.page-link", has_text="Suiv.").get_attribute('href')
            }""")
        # print(f"page :{str(page.url())}")
        # page_number= page.url().split("page=")[-1]

        page.locator("a.page-link", has_text="Suiv.").click()
        return True
    return False


def apec_job_search():
    with sync_playwright() as pw:
        page, browser = fetch_page_content(pw,"https://www.apec.fr/candidat/recherche-emploi.html/emploi/recherche-avancee")
        content=apply_filters(page)
        browser.close()
        return content



