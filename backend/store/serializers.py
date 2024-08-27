from rest_framework import serializers
from .models import Order, Load, OrderImage


class LoadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Load
        fields = ['quantity', 'address', 'date', 'time']


class OrderImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderImage
        fields = ['title', 'image', 'created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    loads = LoadSerializer(many=True)
    images = OrderImageSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = ['order_number', 'loads', 'images', 'status', 'created_at', 'updated_at']
        read_only_fields = ['order_number', 'user', 'status', 'created_at', 'updated_at']
