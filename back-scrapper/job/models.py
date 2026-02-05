from django.db import models

# Create your models here.

# class Entreprise(models.Model):
#     name=models.CharField(max_length=255,primary_key=True)
#     sector=models.CharField(max_length=255,blank=True)
#     description=models.TextField( )
    
    
#     def __str__(self):
#         return f"{self.name} -> {self.sector}"
        
#     class Meta:
#         db_table="entreprises"
        
        
class Job(models.Model):
    _id=models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True)
    experience_level = models.CharField(max_length=255)
    contract_type = models.CharField(max_length=255)
    salary = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    published_date = models.CharField(max_length=255)
    platform=models.CharField(max_length=255)
    enterprise =models.CharField(max_length=255)
    skills=models.JSONField( blank=True)
    link=models.TextField(blank=True,unique=True)
    description = models.TextField()
    
    def __str__(self):
        return f"{self.title} at {self.enterprise} in {self.location}"
    class Meta:
        db_table = 'jobs'