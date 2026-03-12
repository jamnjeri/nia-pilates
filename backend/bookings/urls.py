from django.urls import path
from .views import SessionListView, BookSessionView, CancelBookingView, UserBookingHistoryView, ClassTypeListView

urlpatterns = [
    path('sessions/', SessionListView.as_view(), name='session-list'),   # Browse scheduled classes
    path('class-types/', ClassTypeListView.as_view(), name='class-type-list'), #Browse class types
    path('book/', BookSessionView.as_view(), name='book-session'),       # Make a reservation
    path('history/', UserBookingHistoryView.as_view(), name='booking-history'), # User booking history
    path('cancel/<int:booking_id>/', CancelBookingView.as_view(), name='cancel-booking')  # Cancel booking
]
