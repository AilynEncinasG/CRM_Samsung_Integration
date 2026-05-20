# backend/web_samsung/auth/login_views.py
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny]) # Asegura que cualquiera pueda intentar loguearse
def login_view(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Faltan datos"}, status=400)

        # Esto viajará a Somee a buscar al usuario
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Si el usuario es correcto
            return Response({
                "message": "Login exitoso",
                "user": user.username
            }, status=200)
        else:
            # SI LAS CREDENCIALES SON MALAS:
            # Respondemos explícitamente 401 para que React no falle
            return Response({"error": "Usuario o contraseña incorrectos"}, status=401)

    except Exception as e:
        # Si algo falla en el código, lo imprimimos en la terminal de Docker
        print(f"ERROR CRÍTICO EN LOGIN: {e}")
        return Response({"error": "Error interno del servidor"}, status=500)