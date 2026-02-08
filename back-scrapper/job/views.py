from django.shortcuts import render,HttpResponse

from rest_framework import status,generics
from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from .serializers import JobSerializer,QuestionSerializer
from .models import Job
from .services.shared import llm
import logging
from .services.shared import rendter_cover_letter
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
    
class AskQuestionTesting(generics.GenericAPIView):
    serializer_class=QuestionSerializer
    def get(self,request:Request,*args,**kwargs):
        question =self.get_serializer(data=request.data)
        question.is_valid(raise_exception=True)
        return Response(data=llm.testing(question),status=status.HTTP_200_OK)

class JobList(generics.ListAPIView):
    serializer_class=JobSerializer
    queryset=Job.objects.all()
    permission_classes=[AllowAny]


@api_view(['GET'])
def number_of_jobs(request:Request):
    num_jobs = Job.objects.count()
    return Response({'number_of_jobs': num_jobs}, status=status.HTTP_200_OK)