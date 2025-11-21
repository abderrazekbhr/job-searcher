from .models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.core.cache import cache
import uuid

class UserService:
    
    def create_confirmation_key(self,user:User):
        confirmation_key = uuid.uuid4().hex
        cache.set(confirmation_key,user.email,timeout=3600)
        return confirmation_key


    def send_confirmation_email(self,user:User):
        key = self.create_confirmation_key(user)
        url = f"http://127.0.0.1:8000/api/v1/users/confirm/{key}"
        # Secondly, render the HTML content.
        html_content = render_to_string(
            "mail_content.html",
            context={
                        "firstname": user.first_name,
                        "lastname": user.last_name,
                        "url": url
                    },
            )

        # Then, create a multipart email instance.
        msg = EmailMultiAlternatives(
            subject="Subject here",
            body="",
            from_email="abderrazek455@gmail.com",
            to=["abderrazek455@gmail.com"],
            headers={"List-Unsubscribe": "<mailto:unsub@example.com>"},
        )

        # Lastly, attach the HTML content to the email instance and send.
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    
    
    def create_user(self, user: dict):
        user = User(**user)
        user.save()
        return user
    
    def update_user(self, email, update_fields: dict):
        user = self.get_user_by_email(email)
        user.__dict__.update(update_fields)
        user.save()
        return user
    
    def find_all_users(self):
        return User.objects.all()
    
    def find_user_by_id(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    
    @staticmethod
    def get_user_by_email(email):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None
    
    def find_user_by_id(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None