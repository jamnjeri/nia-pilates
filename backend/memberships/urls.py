from django.urls import path
from .views import PackageListView, InitiatePaymentView, mpesa_callback

urlpatterns = [
    path('templates/', PackageListView.as_view(), name='package-list'),
    path('pay/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('callback/', mpesa_callback, name='mpesa-callback'),
]
