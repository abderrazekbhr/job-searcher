from django.db import models
from django.contrib.auth.models import AbstractUser
from job.models import Job

# Create a custom User model that extends AbstractUser
class User(AbstractUser):
    email = models.EmailField(unique=True)  # Make email the unique identifier
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    password = models.CharField( max_length=128)
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    job=models.ManyToManyField(Job,related_name="condidates",blank=True)
    job_preferences = models.JSONField(blank=True, null=True)
    is_active=models.BooleanField(default=False)
    
    def __str__(self):
        return super().__str__()