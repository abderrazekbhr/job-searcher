from django.urls import path, include
from .views import AskQuestionTesting, apec_job_search_view,generate_cover_letter,JobList, number_of_jobs


urlpatterns = [
    path('<int:nb_jobs>/apec-job-search', apec_job_search_view, name='apec_job_search'),
    path('',JobList.as_view(),name="job_list"),
    path('number-of-jobs', number_of_jobs, name='number_of_jobs'),
    path('cover_letter', generate_cover_letter, name='generate cover letter'),
    path('question', AskQuestionTesting.as_view(),name="ask_question")
]
