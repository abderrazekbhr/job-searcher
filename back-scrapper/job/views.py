from django.shortcuts import render,HttpResponse

from rest_framework import status,generics
from rest_framework.request import Request
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated

from users.models import User
from .serializers import JobSerializer,QuestionSerializer
from .models import Job
from .services.shared import llm
from .services.shared import rendter_cover_letter
from .services.apec.main import ApecJobScraper
from django.shortcuts import get_object_or_404

import logging
import django_filters

logger = logging.getLogger(__name__)

apec_scrapper=ApecJobScraper()


@api_view(['GET'])
def apec_job_search_view(request:Request,nb_jobs:int=30):
    token=request.auth
    email=request.get('email')
    user=get_object_or_404(User,email=email)
    
    if token is None or user is None:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_active:
        return Response({'error': 'User account is not active'}, status=status.HTTP_403_FORBIDDEN)
    
    job_preferences = user.job_preferences
    
    scarpped_jobs=[]
    for job_title in job_preferences:
        logger.info(f"User {user.email} has job preference: {job_title}")
        jobs = apec_scrapper.search_jobs(max_jobs=nb_jobs,job_title=job_title)
        scarpped_jobs.extend(jobs)
    
    
    error_jobs=[]
    saved_jobs=[]
    for job in scarpped_jobs:
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
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]

    permission_classes=[AllowAny]


@api_view(['GET'])
def number_of_jobs(request:Request):
    num_jobs = Job.objects.count()
    return Response({'number_of_jobs': num_jobs}, status=status.HTTP_200_OK)