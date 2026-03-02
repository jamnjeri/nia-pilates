# Nia Pilates Backend
Production-ready backend system for managing memberships, payments, and class bookings for a Pilates studio.

Built with Django and designed with financial integrity, concurrency safety, and real-world payment automation in mind.

# Tech Stack
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication (Simple JWT)
- Safaricom Daraja API (M-Pesa STK Push)

# What this Backend Solves
## 💳 Automated Membership Payments
- M-Pesa STK Push integration
- Webhook-based package activation
- Idempotent callback handling (prevents double activation)
- Transaction ledger for all financial events

## 🎟️ Credit & Guest Pass Engine
- Supports limited and unlimited packages
- Guest passes consumed before credits
- Automatic expiry calculation
- 30-day rolling guest pass refresh (Annual plan)
- Database-level non-negative constraints
- Fully symmetrical booking/cancellation accounting

## 📅 Concurrency-Safe Booking System
- Real-time session capacity enforcement
- Row-level locking (select_for_update)
- Atomic booking & cancellation operations
- 2-hour cancellation cutoff
- Automatic credit refunds

Designed to prevent:
- Overbooking
- Credit drift
- Double payment processing
- Race conditions

# 🏗️ Architecture Highlights
- Atomic database transactions
- Row-level locking for capacity control
- Financial ledger tracking PURCHASE / BOOKING / CANCEL
- Database integrity constraints
- Idempotent webhook processing

This project focuses heavily on **data integrity and financial correctness**.

# Local Setup
```
git clone <repo-url>
cd nia-pilates-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

# Required Environment Variables
```
SECRET_KEY=
DEBUG=

DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=
```

# Purpose
This project demonstrates:
- Real-world payment integration
- Concurrency-safe booking logic
- Financial ledger consistency
- Production-oriented backend design

Built as a portfolio project simulating a live studio environment.


