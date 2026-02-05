from rest_framework import serializers
from .models import Job

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
                "enterprise",
                "skills",
                "link",
                "description"
            ]
        
# class EntrepriseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Entreprise
#         fields="__all__"
        
class QuestionSerializer(serializers.Serializer):
    question = serializers.CharField()


    """
    "title":,
    "experience_level": ,
    "published_date": ,
    "enterprise": ,
    "platform": ,
    "location": ,
    "contract_type": ,
    "salary": ,
    "link": ,
    "skills": [],
    "description": 
    
    
    ///
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
    """