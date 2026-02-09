from django.urls import path, include
from .views import AskQuestionTesting, apec_job_search_view,generate_cover_letter,JobList, number_of_jobs

test_urls = [
    path('ask-question', AskQuestionTesting.as_view(),name="ask_question"),
]
urlpatterns = [
    path('<int:nb_jobs>/fetch/', apec_job_search_view, name='fetch_some_jobs'),
    path('',JobList.as_view(),name="job_list"),
    path('number-of-jobs/', number_of_jobs, name='number_of_jobs'),
    path('cover_letter/', generate_cover_letter, name='generate_cover_letter'),
]

urlpatterns += test_urls