from django.shortcuts import redirect

# Manage error 404
def redirect_to_swagger(request, exception):
    return redirect('swagger-ui')