from django.urls import path
from .views import SessionListView, BookSessionView, CancelBookingView, UserBookingHistoryView

urlpatterns = [
    path('sessions/', SessionListView.as_view(), name='session-list'),   # Browse classes
    path('book/', BookSessionView.as_view(), name='book-session'),       # Make a reservation
    path('history/', UserBookingHistoryView.as_view(), name='booking-history'), # User booking history
    path('cancel/<int:booking_id>/', CancelBookingView.as_view(), name='cancel-booking')  # Cancel booking
]
