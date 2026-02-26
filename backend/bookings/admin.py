from django.contrib import admin
from .models import ClassType, Session, Booking

# Register your models here.
@admin.register(ClassType)
class ClassTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_minutes')

# See Bookings inside the Session page!
class BookingInline(admin.TabularInline):
    model = Booking
    extra = 1 # Number of empty rows to show for quick adding
    fields = ('user', 'slots_reserved', 'status')

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('class_type', 'instructor_name', 'start_time', 'capacity', 'get_booking_count')
    list_filter = ('class_type', 'instructor_name', 'start_time')
    inlines = [BookingInline]

    # Custom column to show how full the class is
    def get_booking_count(self, obj):
        return obj.bookings.count()
    get_booking_count.short_description = 'Booked Slots'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'session', 'status', 'slots_reserved', 'booked_at')
    list_filter = ('status', 'session__class_type')
    search_fields = ('user__name', 'user__phone_number')

