from django.db import models
from django.contrib.auth.models import AbstractUser
from JobSearch.models import Job
# Create a custom User model that extends AbstractUser
class User(AbstractUser):
    email = models.EmailField(unique=True)  # Make email the unique identifier
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    job=models.ManyToManyField(Job,related_name="condidates")
    job_preferences = models.JSONField(blank=True, null=True)
