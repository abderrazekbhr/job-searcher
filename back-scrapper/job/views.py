from django.shortcuts import render,HttpResponse

from rest_framework import status,generics
from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import JobSerializer, EntrepriseSerializer
from .models import Job,Entreprise

import logging
from .services.shared import rendter_cover_letter
from .services.apec import apec_job_search,defined_job_titles
from .services.shared import llm

logger = logging.getLogger(__name__)


# Create your views here.
@api_view(['GET'])
def generate_job_titles_view(request):
    job_titles = defined_job_titles(
    )
    return Response({
        'job_titles': job_titles
    }, status.HTTP_200_OK)


@api_view(['GET'])
def apec_job_search_view(request:Request):
    jobs = apec_job_search()
    error_jobs=[]
    saved_jobs=[]
    for job in jobs:
        serializer=JobSerializer(data=job)
        if serializer.is_valid():
            serializer.save()
            saved_jobs.append(job)
        else:
            print(serializer.errors)
            # logger.error("Validation failed for job create", extra={
            #     "errors": serializer.errors,
            #     "data": job,
            # })
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
    
    



@api_view(['POST'])
def extract_job_hard_skills(request:Request)-> list[str]:
        body=request.data
        description=body["description"]
        if description:
            PROMPT_NAME="extract_skills"
            result=llm.generate(PROMPT_NAME,description)
            return Response(
                data=result,status=status.HTTP_200_OK
            )
        return Response(
                data="this endpoint required description with string type",status=status.HTTP_400_BAD_REQUEST
            )
        