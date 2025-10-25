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


class Profile(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

    class Meta:
        db_table = 'profiles'