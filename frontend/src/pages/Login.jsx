import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Phone, Loader2, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, fetchUserProfile } from '../redux/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const successMessage = location.state?.message;
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });

  useEffect(() => {
    const handleLoginRedirect = async () => {
      if (isLoggedIn) {
        await dispatch(fetchUserProfile());
        navigate('/');
      }
    };
    
    handleLoginRedirect();
  }, [isLoggedIn, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepend 254 to the digits entered by the user
    const formattedPhone = "254" + formData.phone_number.trim();

    dispatch(loginUser({ 
      phone_number: formattedPhone, 
      password: formData.password 
    }));
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[20px] shadow-sm border border-line">
        {/* Success Banner */}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-[10px] text-center">
            {successMessage}
          </div>
        )}
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-3xl text-brown mb-4 inline-block">nia pilates</Link>
          <h2 className="text-2xl font-serif text-black">Welcome back</h2>
          <p className="text-lightbrown text-sm mt-2">Enter your details to access your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Phone number */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-black mb-2">Phone Number</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-2 pointer-events-none border-r border-line pr-2 h-6">
                <span className="text-sm">🇰🇪</span>
                <span className="text-sm font-medium text-lightbrown">+254</span>
              </div>
              <input 
                type="tel" 
                name="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
                className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-20 pr-4 focus:outline-none focus:border-orange transition-colors" 
                placeholder="712 345 678" 
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs uppercase tracking-widest font-bold text-black">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-orange hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-12 focus:outline-none focus:border-orange transition-colors" 
                placeholder="••••••••" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lightbrown hover:text-orange transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className="w-full bg-brown text-white py-4 rounded-[10px] font-medium hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-3">
            <p className="text-red-600 text-xs text-center font-medium">
              {typeof error === 'string' ? error : "Incorrect phone number or password."}
            </p>
          </div>
        )}

        <p className="text-center mt-8 text-sm text-btext">
          Don't have an account? <Link to="/register" className="text-orange font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
