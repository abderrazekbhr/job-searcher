from django.urls import path, include
from .views import apec_job_search_view,generate_cover_letter


urlpatterns = [
    path('<int:nb_jobs>/apec-job-search', apec_job_search_view, name='apec_job_search'),
    path('cover_letter', generate_cover_letter, name='generate cover letter'),
]
