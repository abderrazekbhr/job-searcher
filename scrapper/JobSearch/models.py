from django.db import models

# Create your models here.
class Job(models.Model):
    _id=models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True)
    experience_level = models.CharField(max_length=100)
    contract_type = models.CharField(max_length=100)
    salary = models.CharField(max_length=10, blank=True, null=True)
    location = models.CharField(max_length=255)
    published_date = models.DateField()
    city = models.CharField(max_length=100)
    enterprise = models.CharField(max_length=255)
    other_details = models.JSONField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} at {self.enterprise} in {self.location}"
    class Meta:
        db_table = 'jobs'