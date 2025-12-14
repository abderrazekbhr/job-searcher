from django.shortcuts import render,HttpResponse

from rest_framework import status,generics
from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import JobSerializer, EntrepriseSerializer
from .models import Job,Entreprise

import logging
from .services.shared import rendter_cover_letter
from .services.shared import llm
from .services.apec.main import ApecJobScraper
logger = logging.getLogger(__name__)

apec_scrapper=ApecJobScraper()


@api_view(['GET'])
def apec_job_search_view(request:Request,nb_jobs:int):
    jobs = apec_scrapper.search_jobs(max_jobs=nb_jobs)
    error_jobs=[]
    saved_jobs=[]
    for job in jobs:
        serializer=JobSerializer(data=job)
        if serializer.is_valid():
            serializer.save()
            saved_jobs.append(job)
        else:
            error_jobs.append(job)
    return Response({
        'saved_job':saved_jobs,
        'error_job':error_jobs
    }, status.HTTP_200_OK)

@api_view(["GET"])
def generate_cover_letter(request):
    return HttpResponse(
        content=rendter_cover_letter()
    )


class CreateJobs(generics.CreateAPIView):
    serializer_class=JobSerializer
    queryset=Job.objects.all()
    
    


