#!/bin/bash

# 1. Start Redis in the background
redis-server --daemonize yes

# 2. Run Migrations & Collect Static
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# 3. Start Celery Beat in the background
celery -A config beat --loglevel=info &

# 4. Start Celery Worker in the background (1 task at a time)
celery -A config worker --loglevel=info --concurrency=1 &

# 5. Start Django using Gunicorn (The production server - 2 workers only to try stay within 512MB RAM)
exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2

