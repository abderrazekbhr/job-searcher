from rest_framework import serializers
from .models import Job,Entreprise

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model=Job
        fields=[
                "title",
                "experience_level",
                "contract_type",
                "salary",
                "location",
                "published_date",
                "platform",
                "skills",
                "link",
                "other_details"
            ]
        
class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Entreprise
        fields="__all__"