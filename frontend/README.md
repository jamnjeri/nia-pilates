# Nia Pilates — Frontend

Frontend client for the **Nia Pilates Studio Management System**.  
Built with React + Vite for a fast, responsive experience where users can browse classes, manage bookings, and handle payments.

---

## 🚀 Tech Stack

- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router
- Lucide React

---

## ⚙️ Environment Setup

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 🧪 Run Locally
```bash
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 📁 Structure
```
src/
├── api/         # Axios config
├── app/         # Redux store
├── features/    # Redux slices
├── pages/       # Route pages
├── components/  # UI components
```

---

## ✨ Features
- JWT Authentication (login/register)
- Dynamic landing page (API-driven)
- Live class scheduling & filtering
- Member dashboard (credits & bookings)
- M-Pesa payments (in progress)

---

## 🔗 API
Uses a centralized Axios instance:
```JS
baseURL: import.meta.env.VITE_API_URL
```

---

## 📦 Build
```npm run build```

## 📝 Notes
- Env variables must start with `VITE_`
- `.env` is ignored; use `.env.example` as reference

## 🎥 Demo

![Nia Pilates Demo](./public/demo.gif)

