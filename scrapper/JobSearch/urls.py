from django.urls import path, include
from JobSearch.views import generate_job_titles_view,apec_job_search_view
urlpatterns = [
    path('generate-job-titles/', generate_job_titles_view, name='generate_job_titles'),
    path('apec-job-search/', apec_job_search_view, name='apec_job_search'),
]