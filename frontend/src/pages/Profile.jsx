import { User, Mail, Calendar, CreditCard, Ticket, ChevronRight, Plus, Home, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // Temporary State Mockups
  const user = {
    name: "Jane Wambui",
    email: "jane.wambui@example.com",
    memberSince: "Jan 2026",
    status: "Active", 
    subscription: "Monthly Plan",
    credits: 12,
    guestPasses: 1,
    upcomingClasses: [] 
  };

  const handleSignOut = () => {
    // We will add the Redux logout logic here tomorrow
    console.log("Signing out...");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-beige pb-20">
      {/* Top Utility Nav */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-line px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-brown hover:text-orange transition-colors group">
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-lightbrown hover:text-red-600 transition-colors group"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-line pt-12 pb-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-24 h-24 bg-greybeige rounded-full flex items-center justify-center border-2 border-orange/20 relative">
            <User size={48} className="text-brown" />
            {/* <div className="absolute bottom-0 right-0 w-6 h-6 bg-orange rounded-full border-4 border-white flex items-center justify-center">
              <Plus size={12} className="text-white" />
            </div> */}
          </div>
          
          <div className="flex-grow space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="font-serif text-3xl text-black">{user.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mx-auto md:mx-0 ${
                user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {user.status} Member
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-lightbrown text-sm">
              <span className="flex items-center gap-1 justify-center md:justify-start">
                <Mail size={14} /> {user.email}
              </span>
              <span className="flex items-center gap-1 justify-center md:justify-start">
                <Calendar size={14} /> Joined {user.memberSince}
              </span>
            </div>
          </div>
          
          <button className="bg-brown text-white px-6 py-2 rounded-[10px] text-sm font-medium hover:bg-black transition-all">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats and Classes Grid */}
      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Membership */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-line">
            <h3 className="font-serif text-xl mb-6 flex items-center gap-2 text-black">
              <CreditCard size={20} className="text-orange" /> Membership
            </h3>
            
            <div className="space-y-4">
              <div className="bg-greybeige p-4 rounded-[12px] border border-line/50">
                <p className="text-[10px] uppercase tracking-widest text-lightbrown font-bold mb-1">Current Plan</p>
                <p className="text-black font-semibold text-lg">{user.subscription || "No active plan"}</p>
                {user.status !== 'Active' && (
                  <Link to="/#pricing" className="text-orange text-xs font-bold mt-2 inline-block hover:underline">
                    Upgrade Plan
                  </Link>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 bg-greybeige p-4 rounded-[12px] border border-line/50">
                  <p className="text-[10px] uppercase tracking-widest text-lightbrown font-bold mb-1">Credits</p>
                  <p className="text-3xl font-serif text-brown">{user.credits}</p>
                </div>
                <div className="flex-1 bg-greybeige p-4 rounded-[12px] border border-line/50">
                  <p className="text-[10px] uppercase tracking-widest text-lightbrown font-bold mb-1">Guest Passes</p>
                  <p className="text-3xl font-serif text-brown">{user.guestPasses}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Classes */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-line min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-serif text-2xl text-black">Your Schedule</h3>
              <Link to="/#classes" className="text-orange text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest bg-orange/5 px-3 py-2 rounded-lg">
                Book a class <ChevronRight size={14} />
              </Link>
            </div>

            {user.upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {/* Booked classes will be mapped here tomorrow */}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-greybeige rounded-full flex items-center justify-center text-lightbrown/40 border border-line/50">
                  <Ticket size={40} />
                </div>
                <div className="max-w-xs space-y-2">
                  <p className="text-black font-serif text-xl">No active bookings</p>
                  <p className="text-lightbrown text-sm leading-relaxed">
                    Ready to flow? Explore our upcoming Reformer and Mat sessions and find your next practice.
                  </p>
                </div>
                <button className="bg-brown text-white px-10 py-3 rounded-[10px] font-medium hover:bg-black transition-all text-sm shadow-md">
                  Browse Schedule
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
