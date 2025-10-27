from django.db import models

# Create your models here.

class Entreprise(models.Model):
    name=models.CharField(max_length=50,primary_key=True)
    sector=models.CharField(max_length=100,null=True)
    nb_employers=models.CharField(max_length=100,null=True)
    other_details=models.JSONField(blank=True,null=True)
    
    
    def __str__(self):
        return f"{self.name} -> {self.sector}"
        
    class Meta:
        db_table="entreprises"
        
        
class Job(models.Model):
    _id=models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True)
    experience_level = models.CharField(max_length=100)
    contract_type = models.CharField(max_length=100)
    salary = models.CharField(max_length=10, blank=True, null=True)
    location = models.CharField(max_length=255)
    published_date = models.DateField()
    platform=models.CharField(max_length=50,default="none")
    enterprise =models.ForeignKey(
        Entreprise,related_name='jobs',on_delete=models.CASCADE
    ) 
    skills=models.JSONField(blank=True, null=True)
    link_job=models.TextField(null=True)
    other_details = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} at {self.enterprise} in {self.location}"
    class Meta:
        db_table = 'jobs'
        """
db_table: Customizes the name of the database table.

ordering: Sets the default ordering of records.

verbose_name: Provides a user-friendly singular name for the model.

verbose_name_plural: Provides a user-friendly plural name for the model.

unique_together: Enforces a unique constraint across multiple fields.

index_together: Creates an index on multiple fields for performance.

indexes: Custom database indexes for performance.

permissions: Defines custom permissions.

default_related_name: Sets default reverse relation names.

apps: Overrides the app label.
"""