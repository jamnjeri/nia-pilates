import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-beige">
        <Routes>
          {/* Main Landing Page with sections */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* 404 Page (Optional) */}
          <Route path="*" element={
            <div className="h-screen flex items-center justify-center font-serif text-brown">
              404 | Page Not Found
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
