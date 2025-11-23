from pypdf import PdfReader
from config.generative_ia import PromptConfig
from django.template import loader

PROMPT_PATH="config/prompts"

llm=PromptConfig(
    path=PROMPT_PATH
)

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
    PROMPT_NAME="generate_job_titles"
    cv_content = load_cv_from_file("static/ressources/CV_Abderrazek BELHAJ RHOUMA.pdf")
    
    generated = llm.generate(prompt_name=PROMPT_NAME,cv_content=cv_content) 
    
    return generated
"""
generate motivation lettre using job description and cv content in pdf format
"""
def rendter_cover_letter():
    loaded_template=loader.get_template("coverLetter.html")
    return loaded_template.render()
