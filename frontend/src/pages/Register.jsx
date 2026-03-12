import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import { useState, useEffect } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '', 
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const { isLoggedIn, loading, error, registrationSuccess } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    // Redirect if already logged in
    if (isLoggedIn) {
      navigate('/');
    }

    // Redirect to login after successful account creation
    if (registrationSuccess) {
      navigate('/login', { 
        state: { message: "Account created successfully! Please sign in." } 
      });
      dispatch(resetRegisterSuccess());
    }
  }, [isLoggedIn, registrationSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match"); // Triggers the p tag below
      return;
    }

    // 2. Prepend 254 to the phone number
    const formattedPhone = "254" + formData.phone_number.trim();
    
    // 3. Prepare the final payload
    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formattedPhone,
      password: formData.password
    };
    
    dispatch(registerUser(payload));
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-[20px] shadow-sm border border-line">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-3xl text-brown mb-4 inline-block">nia pilates</Link>
          <h2 className="text-2xl font-serif text-black">Create an account</h2>
          <p className="text-lightbrown text-sm mt-2">Join our community in Nairobi today</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={16} />
              <input 
                type="text" 
                required
                className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange" 
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={16} />
              <input 
                type="email" 
                required
                className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange" 
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Phone Number with Kenyan Prefix */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black">Phone Number</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-2 pointer-events-none border-r border-line pr-2 h-5">
                <span className="text-xs">🇰🇪</span>
                <span className="text-xs font-medium text-lightbrown">+254</span>
              </div>
              <input 
                type="tel" 
                required
                className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-20 pr-4 text-sm focus:outline-none focus:border-orange" 
                placeholder="712 345 678"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={16} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-orange" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lightbrown"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 pb-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={16} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange" 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brown text-white py-4 rounded-[10px] font-medium hover:bg-black transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        {(localError || error) && (
          <p className="text-red-500 text-xs text-center mb-4 font-medium animate-pulse">
            {localError || (typeof error === 'string' ? error : "Something went wrong")}
          </p>
        )}

        <p className="text-center mt-8 text-sm text-btext">
          Already have an account? <Link to="/login" className="text-brown font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
