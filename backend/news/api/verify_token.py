from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework.response import Response
from rest_framework import status


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            return Response({"message": "Token is valid",
                             "success": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "Token is invalid "
                                        "or expired", "success": False},
                            status=status.HTTP_401_UNAUTHORIZED)