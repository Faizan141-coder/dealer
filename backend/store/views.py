from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import uuid
import json

from .models import Order, Load, OrderImage
from .serializers import OrderSerializer
from invoice.models import Invoice


class OrderAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, JSONParser, FormParser]

    def get(self, request, *args, **kwargs):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Extract loads data from the request
        loads_data = request.data.get('loads')
        if loads_data is None:
            return Response({"loads": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure loads_data is a list
        if isinstance(loads_data, str):
            try:
                loads_data = json.loads(loads_data)
            except json.JSONDecodeError:
                return Response({"loads": ["Invalid format."]}, status=status.HTTP_400_BAD_REQUEST)
        elif not isinstance(loads_data, list):
            return Response({"loads": ["Expected list format."]}, status=status.HTTP_400_BAD_REQUEST)

        # Create the order
        order = Order.objects.create(
            user=request.user
        )

        # Create Load instances
        for load_data in loads_data:
            Load.objects.create(
                order=order,
                quantity=load_data.get('quantity'),
                address=load_data.get('address'),
                date=load_data.get('date'),
                time=load_data.get('time')
            )

        # Create an invoice for the order
        invoice = Invoice.objects.create(
            client=order.user,
            title=f"Invoice for Order {order.order_number}",
            number=self.generate_invoice_number(),
            order=order,
        )

        # Associate invoice with the order
        order.invoice = invoice
        order.save()

        # Handle images
        images = request.FILES.getlist('images')
        for image in images:
            OrderImage.objects.create(order=order, image=image)

        return Response(
            {"message": "Order created successfully", "order": OrderSerializer(order).data},
            status=status.HTTP_201_CREATED
        )

    def generate_invoice_number(self):
        return str(uuid.uuid4()).split('-')[0].upper()
