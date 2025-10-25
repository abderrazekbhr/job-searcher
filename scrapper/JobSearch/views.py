from django.shortcuts import render
from JobSearch.service import defined_job_titles
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from JobSearch.service import apec_job_search
# Create your views here.
@api_view(['GET'])
def generate_job_titles_view(request):
    job_titles = defined_job_titles()
    return Response({
        'job_titles': job_titles
    }, status.HTTP_200_OK)


@api_view(['GET'])
def apec_job_search_view(request):
    content = apec_job_search()
    return Response({
        'apec_job_search_content': content
    }, status.HTTP_200_OK)