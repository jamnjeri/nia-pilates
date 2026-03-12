import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, Hash } from 'lucide-react';
import api from '../api/axios'; 

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    phone_number: '', // Local 9 digits
    otp_code: '',
    new_password: ''
  });

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Prepend 254 for the backend request
      const formattedPhone = "254" + formData.phone_number.trim();
      await api.post('/accounts/password-reset/request/', { phone_number: formattedPhone });
      setStep(2);
    } catch (err) {
      // Backend security: Always looks like success, but we handle rate limits/errors
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify & Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formattedPhone = "254" + formData.phone_number.trim();
      const payload = {
        phone_number: formattedPhone,
        otp_code: formData.otp_code,
        new_password: formData.new_password
      };
      
      // Verification Endpoint
      await api.post('/accounts/password-reset/verify/', payload);
      
      navigate('/login', { state: { message: "Password reset successfully. Please sign in." } });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[20px] shadow-sm border border-line">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-black">
            {step === 1 ? "Reset Password" : "Verify Reset"}
          </h2>
          <p className="text-lightbrown text-sm mt-2 font-light">
            {step === 1 
              ? "Enter your registered phone number." 
              : "Enter the code sent to your device."}
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mb-6 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
            {error}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
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
                  placeholder="7XX XXX XXX"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                />
              </div>
            </div>
            <button 
              disabled={loading}
              className="w-full bg-brown text-white py-4 rounded-[10px] font-medium hover:bg-black transition-all flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Request Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* OTP Entry */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-black">6-Digit Code</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={16} />
                <input 
                  type="text" 
                  maxLength="6"
                  required
                  className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-orange tracking-[0.4em] font-bold" 
                  placeholder="000000"
                  value={formData.otp_code}
                  onChange={(e) => setFormData({...formData, otp_code: e.target.value})}
                />
              </div>
            </div>

            {/* New Password Entry */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-black">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-orange" 
                  placeholder="••••••••"
                  value={formData.new_password}
                  onChange={(e) => setFormData({...formData, new_password: e.target.value})}
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

            <button 
              disabled={loading}
              className="w-full bg-brown text-white py-4 rounded-[10px] font-medium hover:bg-black transition-all flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-[10px] uppercase tracking-wider text-lightbrown hover:text-orange transition-colors font-bold"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <Link to="/login" className="mt-8 text-sm text-orange font-medium flex items-center justify-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
