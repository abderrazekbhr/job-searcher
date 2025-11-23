from django.urls import path, include
from .views import generate_job_titles_view,apec_job_search_view,generate_cover_letter,extract_job_hard_skills
urlpatterns = [
    path('generate-job-titles', generate_job_titles_view, name='generate_job_titles'),
    path('apec-job-search', apec_job_search_view, name='apec_job_search'),
    path('cover_letter', generate_cover_letter, name='generate cover letter'),
    path('skills',extract_job_hard_skills,name="generate skills")
]
