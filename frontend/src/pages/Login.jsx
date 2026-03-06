import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[20px] shadow-sm border border-line">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-3xl text-brown mb-4 inline-block">nia pilates</Link>
          <h2 className="text-2xl font-serif text-black">Welcome back</h2>
          <p className="text-lightbrown text-sm mt-2">Enter your details to access your account</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-black mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={18} />
              <input type="email" className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 focus:outline-none focus:border-orange transition-colors" placeholder="hello@example.com" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs uppercase tracking-widest font-bold text-black">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-orange hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={18} />
              <input type="password" className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 focus:outline-none focus:border-orange transition-colors" placeholder="••••••••" />
            </div>
          </div>

          <button className="w-full bg-brown text-white py-4 rounded-[10px] font-medium hover:bg-black transition-all flex items-center justify-center gap-2">
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-btext">
          Don't have an account? <Link to="/register" className="text-orange font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
