from decimal import Decimal

from rest_framework import serializers

from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'title', 'amount', 'category', 'category_display',
            'payment_method', 'payment_method_display', 'date', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def validate_amount(self, value):
        if value is None or value <= Decimal('0'):
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value
