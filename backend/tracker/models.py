from django.core.exceptions import ValidationError
from django.db import models


class Expense(models.Model):
    """A single expense entry."""

    class Category(models.TextChoices):
        FOOD = 'FOOD', 'Food & Dining'
        TRAVEL = 'TRAVEL', 'Travel'
        RENT = 'RENT', 'Rent'
        UTILITIES = 'UTILITIES', 'Utilities'
        EDUCATION = 'EDUCATION', 'Education'
        SHOPPING = 'SHOPPING', 'Shopping'
        ENTERTAINMENT = 'ENTERTAINMENT', 'Entertainment'
        HEALTH = 'HEALTH', 'Health'
        OTHER = 'OTHER', 'Other'

    class PaymentMethod(models.TextChoices):
        CASH = 'CASH', 'Cash'
        UPI = 'UPI', 'UPI'
        CARD = 'CARD', 'Card'
        NET_BANKING = 'NET_BANKING', 'Net Banking'

    title = models.CharField(max_length=150)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.OTHER)
    payment_method = models.CharField(
        max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.UPI
    )
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} — ₹{self.amount} ({self.get_category_display()})"

    def clean(self):
        if self.amount is not None and self.amount <= 0:
            raise ValidationError("Amount must be greater than zero.")
