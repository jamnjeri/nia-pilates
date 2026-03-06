import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[20px] shadow-sm border border-line text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-black">Reset Password</h2>
          <p className="text-lightbrown text-sm mt-2">Enter your email and we'll send you instructions to reset your password.</p>
        </div>

        <form className="space-y-6 text-left">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-black mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={18} />
              <input type="email" className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 focus:outline-none focus:border-orange transition-colors" placeholder="hello@example.com" />
            </div>
          </div>

          <button className="w-full bg-brown text-white py-4 rounded-[10px] font-medium hover:bg-black transition-all">
            Send Reset Link
          </button>
        </form>

        <Link to="/login" className="mt-8 text-sm text-orange font-medium flex items-center justify-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
