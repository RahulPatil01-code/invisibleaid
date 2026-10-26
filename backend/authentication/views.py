from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer, ChangePasswordSerializer, UserSerializer
from audit.utils import log_action


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        # RegisterSerializer's fields (org_type, org_name, phone, ...) are
        # write-only input for creating the Organization + User — they
        # don't map onto attributes of the returned User object. The
        # default CreateAPIView.create() tries to re-serialize the created
        # instance through the *same* serializer for the response, which
        # blows up here (User has no `org_type`). So build the response
        # with UserSerializer instead, which is designed to represent a
        # User.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        log_action(user, 'USER_REGISTERED', 'User', str(user.id))

        output = UserSerializer(user, context=self.get_serializer_context())
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(username=serializer.validated_data['email'], password=serializer.validated_data['password'])
        if user:
            refresh = RefreshToken.for_user(user)
            log_action(user, 'LOGIN_SUCCESS', 'User', str(user.id))
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data,
            })
        log_action(None, 'LOGIN_FAILURE', 'User', serializer.validated_data['email'])
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user


class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except (KeyError, TokenError):
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        log_action(request.user, 'PASSWORD_CHANGED', 'User', str(request.user.id))
        return Response({'detail': 'Password changed successfully.'})