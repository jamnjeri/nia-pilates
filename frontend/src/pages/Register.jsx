import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-[20px] shadow-sm border border-line">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-3xl text-brown mb-4 inline-block">nia pilates</Link>
          <h2 className="text-2xl font-serif text-black">Create an account</h2>
          <p className="text-lightbrown text-sm mt-2">Join our community in Nairobi today</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-black mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={18} />
              <input type="text" className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 focus:outline-none focus:border-orange transition-colors" placeholder="Jane Doe" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-black mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={18} />
              <input type="email" className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 focus:outline-none focus:border-orange transition-colors" placeholder="jane@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-black mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-lightbrown" size={18} />
              <input type="password" className="w-full bg-greybeige border border-line rounded-[10px] py-3 pl-10 pr-4 focus:outline-none focus:border-orange transition-colors" placeholder="••••••••" />
            </div>
          </div>

          <button className="w-full bg-brown text-white py-4 rounded-[10px] font-medium hover:bg-black transition-all mt-4">
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-btext">
          Already have an account? <Link to="/login" className="text-brown font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
