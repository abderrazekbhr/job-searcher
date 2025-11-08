from .models import User


class UserService:

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