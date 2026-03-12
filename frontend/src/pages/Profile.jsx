import { User, Mail, Calendar, CreditCard, Ticket, ChevronRight, Home, LogOut, Loader2, Zap, History, LifeBuoy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useEffect, useState } from 'react';
import SupportModal from '../modals/SupportModal';
import ScheduleModal from '../modals/ScheduleModal';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth); // Pulling your real data
  const [isSupportOpen, setIsSupportOpen] = useState(false);


  // useEffect(() => {
  //   if (user) {
  //     console.log("Current User Data in Profile:", user); //
  //   }
  // }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <Loader2 className="animate-spin text-orange" size={40} />
      </div>
    );
  }

  const { user_info, active_memberships, upcoming_classes, attendance_history } = user;
  const hasMembership = active_memberships && active_memberships.length > 0;
  const currentPlan = hasMembership ? active_memberships[0] : null;

  const formatSessionTime = (isoString) => {
  const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  return (
    <div className="min-h-screen bg-beige pb-20">
      {/* Top Utility Nav */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-line px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-brown hover:text-orange transition-colors group">
            <Home size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
          </Link>
          <button onClick={() => dispatch(logout())} className="flex items-center gap-2 text-lightbrown hover:text-red-600 transition-colors">
            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-line pt-12 pb-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-24 h-24 bg-greybeige rounded-full flex items-center justify-center border-2 border-orange/20">
            <User size={48} className="text-brown" />
          </div>
          <div className="flex-grow space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="font-serif text-3xl text-black">{user_info.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mx-auto md:mx-0 ${
                hasMembership ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {hasMembership ? 'Active Member' : 'New Account'}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-lightbrown text-sm">
              <span className="flex items-center gap-1 justify-center md:justify-start">
                <Mail size={14} /> {user_info.email}
              </span>
              <span className="flex items-center gap-1 justify-center md:justify-start">
                <Calendar size={14} /> Joined {new Date(user_info.date_joined).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Membership & Stats */}
        <div className="space-y-6">
          {/* Current Membership Box */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-line">
            <h3 className="font-serif text-xl mb-6 flex items-center gap-2 text-black text-left">
              <CreditCard size={20} className="text-orange" /> Current Membership
            </h3>
            {hasMembership ? (
              <div className="space-y-4">
                <div className="bg-greybeige p-4 rounded-[12px] border border-line/50 text-left">
                  <p className="text-[10px] uppercase tracking-widest text-lightbrown font-bold mb-1">Plan</p>
                  <p className="text-black font-semibold text-lg capitalize">{currentPlan.plan_name.toLowerCase()}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-greybeige p-4 rounded-[12px] border border-line/50 text-left">
                    <p className="text-[10px] uppercase tracking-widest text-lightbrown font-bold mb-1">Credits</p>
                    <p className="text-3xl font-serif text-brown">{currentPlan.remaining_credits}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-left space-y-4">
                <p className="text-sm text-lightbrown">No active membership found.</p>
                <Link to="/#pricing" className="block w-full bg-orange text-white text-center py-3 rounded-[10px] text-xs font-bold uppercase tracking-widest">
                  View Packages
                </Link>
              </div>
            )}
          </div>

          {/* Stats Box */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-line text-left">
            <h3 className="font-serif text-xl mb-6 flex items-center gap-2 text-black">
              <Zap size={20} className="text-orange" /> Studio Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <p className="text-2xl font-serif text-black">{user_info.classes_attended_count || 0}</p>
                  <p className="text-[10px] uppercase tracking-widest text-lightbrown font-bold">Classes Done</p>
               </div>
               <div className="space-y-1">
                  <p className="text-2xl font-serif text-black">0</p>
                  <p className="text-[10px] uppercase tracking-widest text-lightbrown font-bold">Day Streak</p>
               </div>
            </div>
          </div>

          {/* Help Box */}
          <div className="bg-brown/90 p-6 rounded-[20px] shadow-sm text-left">
            <h3 className="font-serif text-white text-lg mb-2 flex items-center gap-2">
              <LifeBuoy size={18} /> Need Help?
            </h3>
            <p className="text-white text-xs leading-relaxed mb-4">Our team is here to support your practice.</p>
            <button
              onClick={() => setIsSupportOpen(true)}
              className="w-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-[10px] hover:bg-white/20 transition-all">
              Contact Support
            </button>
          </div>
        </div>

        {/* Right Column: Your Schedule & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Classes */}
          <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-line min-h-[300px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-serif text-2xl text-black">Your Schedule</h3>
              <Link to="/#classes" className="text-orange text-xs font-bold uppercase tracking-widest bg-orange/5 px-3 py-2 rounded-lg">
                Book Session
              </Link>
            </div>
            {upcoming_classes && upcoming_classes.length > 0 ? (
              <div className="space-y-4">
                {upcoming_classes.map((booking) => {
                  const { date, time } = formatSessionTime(booking.start_time);
                  const isToday = new Date(booking.start_time).toDateString() === new Date().toDateString();

                  return (
                    <div key={booking.booking_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-greybeige rounded-[20px] border border-line/50 hover:border-orange/30 transition-all gap-4 text-left">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isToday ? 'bg-orange text-white' : 'bg-white text-orange'} border border-line shadow-sm`}>
                          <Calendar size={20} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-black text-lg">{booking.class_name}</p>
                            {isToday && (
                              <span className="bg-orange/10 text-orange text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Today</span>
                            )}
                          </div>
                          <p className="text-xs text-lightbrown font-medium flex items-center gap-1">
                            With {booking.instructor} • {date} at {time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-lightbrown hover:text-red-500 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center space-y-4">
                <Ticket size={32} className="mx-auto text-lightbrown/30" />
                <p className="text-lightbrown text-sm">You have no upcoming sessions booked.</p>
              </div>
            )}
          </div>

          {/* Attendance History */}
          <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-line">
            <h3 className="font-serif text-2xl text-black mb-8 flex items-center gap-2">
               <History size={24} className="text-orange" /> Class History
            </h3>
            {attendance_history && attendance_history.length > 0 ? (
               <div className="space-y-4"> {/* Past sessions mapping */} </div>
            ) : (
               <p className="text-center py-10 text-lightbrown text-sm italic">Your practice journey starts here.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <SupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
      />
    </div>
  );
};

export default Profile;
