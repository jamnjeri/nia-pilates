# Nia Pilates: Boutique Studio Management System

A full-stack boutique studio management platform designed for the Kenyan market, featuring real-time class scheduling, membership management, and M-Pesa integrated payments.

---

## 🏗 Project Architecture

The project is split into two main directories:

- **/frontend**: A high-performance React application built with **Vite**, **Redux Toolkit**, and **Tailwind CSS**.
- **/backend**: A robust **Django REST Framework** API containerized with **Docker**, featuring **Celery** for background task processing and **Redis** for caching.

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose  
- Node.js (v18+)  
- Python 3.10+

### Quick Start

#### 1. Clone the repository

```bash
git clone https://github.com/jamila/nia-pilates.git
cd nia-pilates
```

#### 2. Launch the Backend (Docker)
```bash
cd backend
docker compose up --build
```
This starts the **Django API**, **PostgreSQL database**, **Redis**, and **Celery workers**.

#### 3. Launch the Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Features & Status
## 🛠 Features & Status

| Feature | Status | Description |
|--------|--------|-------------|
| User Auth | ✅ Done | JWT-based Login, Registration, and Password Reset |
| Dynamic Landing | ✅ Done | Auto-hydrating Hero, Classes, and Pricing sections from API |
| Live Schedule | ✅ Done | Real-time session browsing with dynamic filtering by class type |
| Profile Dashboard | ✅ Done | Member status, credit tracking, and personal booking schedule |
| M-Pesa Integration | ⏳ In-Progress | STK Push for membership purchases and automated payment cleanup |
| Booking System | ⏳ In-Progress | Credit-based mat reservation and attendance history tracking |

---

## 📁 Repository Structure

### `/frontend`

- **Redux Toolkit** – Centralized state management for Auth, Class Types, Packages, and Sessions
- **Tailwind CSS** – Custom "Studio" theme with beige/brown/orange aesthetics
- **Lucide React** – Consistent iconography for studio navigation

### `/backend`

- **Django REST Framework** – Clean API endpoints for all studio resources
- **Celery & Redis** – Handles M-Pesa callback polling and no-show processing
- **Dockerized** – Optimized for development with hot-reloading volumes

---

## 📝 Planned Improvements (Phase 2)

- **Admin Analytics** – Dashboard for studio owners to track revenue and attendance
- **Instructor Portal** – Mobile-friendly view for instructors to mark attendance
- **Email Notifications** – Automated booking confirmations and membership expiry alerts



