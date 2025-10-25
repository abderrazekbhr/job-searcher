from django.db import models

# Create your models here.
class User(models.Model):
    email = models.EmailField(unique=True, primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    job_preferences = models.JSONField(blank=True, null=True)
    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'users'
