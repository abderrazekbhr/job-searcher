from pypdf import PdfReader
from config.generative_ia import generate
from django.template import loader

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
"""
generate motivation lettre using job description and cv content in pdf format
"""
def rendter_cover_letter():
    loaded_template=loader.get_template("coverLetter.html")
    return loaded_template.render()
