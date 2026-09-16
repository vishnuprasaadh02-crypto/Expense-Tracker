from django.db.models import Sum, Count
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    CRUD API for expenses.

    list:        GET    /api/expenses/
    retrieve:    GET    /api/expenses/{id}/
    create:      POST   /api/expenses/
    update:      PUT    /api/expenses/{id}/
    partial:     PATCH  /api/expenses/{id}/
    destroy:     DELETE /api/expenses/{id}/
    stats:       GET    /api/expenses/stats/
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'payment_method']
    search_fields = ['title', 'notes']
    ordering_fields = ['date', 'amount', 'updated_at']

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Total spend + per-category breakdown, for the dashboard cards."""
        qs = self.filter_queryset(self.get_queryset())
        total = qs.aggregate(total=Sum('amount'))['total'] or 0
        count = qs.count()
        by_category = (
            qs.values('category')
            .annotate(total=Sum('amount'), count=Count('id'))
            .order_by('-total')
        )
        return Response({
            'total': total,
            'count': count,
            'by_category': list(by_category),
        }, status=status.HTTP_200_OK)
