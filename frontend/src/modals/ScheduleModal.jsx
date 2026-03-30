import { X, Calendar, Clock, Loader2, Users, ShieldCheck, SearchX, AlertCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookSession } from '../redux/bookingSlice';
import confetti from 'canvas-confetti';

const ScheduleModal = ({ isOpen, onClose, classType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSuccess, setIsSuccess] = useState(false);

  const { items, loading } = useSelector((state) => state.sessions);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { error: bookingError, success: bookingSuccess, loading: bookingLoading } = useSelector((state) => state.bookings);

  const [processingId, setProcessingId] = useState(null);
  
  const [activeFilter, setActiveFilter] = useState(classType || "All");
  const availableTypes = ["All", ...new Set(items.map(s => s.class_name))];

  const formatSessionTime = (isoString) => {
  const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  useEffect(() => {
    setActiveFilter(classType || "All");
  }, [classType]);

  // Filter the live sessions based on the selected type
  const filteredSessions = items.filter(session => {
    if (activeFilter === "All") return true;
    return session.class_name === activeFilter;
  });

  const handleBookingClick = async (sessionId) => {
    if (!isLoggedIn) {
      navigate('/login');
      onClose();
      return;
    }
    
    setProcessingId(sessionId);
    // Trigger the actual booking endpoint
    const result = await dispatch(bookSession(sessionId));

    if (bookSession.fulfilled.match(result)) {
      setIsSuccess(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E88D67', '#4E362A', '#F5F5DC']
      });

      setTimeout(() => {
        onClose(); // Close modal on success
        setIsSuccess(false); // Reset for next time
        navigate('/profile');
      }, 2000);
    } else {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-beige w-full max-w-lg sm:rounded-[30px] rounded-t-[32px] max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 flex flex-col">
        {isSuccess ? (
          // SUCCESS VIEW
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="text-green-600" size={40} />
            </div>
            <h3 className="font-serif text-3xl text-black">Mat Reserved!</h3>
            <p className="text-lightbrown text-sm">See you at the studio.</p>
          </div>
          ) : (
          <>
          {/* Header */}
          <div className="p-6 border-b border-line bg-white sticky top-0 z-10 text-left">
            <button onClick={onClose} className="absolute right-8 top-8 text-lightbrown hover:text-black transition-colors"><X size={24}/></button>
            <p className="text-orange text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Live Schedule</p>
            <h3 className="font-serif text-3xl text-black">{classType || "All Sessions"}</h3>

            {/* Quick Filter Pills */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
              {availableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all border ${
                    activeFilter === type 
                    ? 'bg-orange text-white border-orange shadow-md' 
                    : 'bg-greybeige text-lightbrown border-transparent hover:border-line'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Error Nudge for Low Credits */}
          {bookingError && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-[11px] text-red-700 font-medium">
                {bookingError}. <Link to="/#pricing" onClick={onClose} className="underline font-bold">Buy more credits</Link>
              </p>
            </div>
          )}

          {/* Scrollable List */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-orange" size={32} />
                <p className="text-sm text-lightbrown font-medium">Syncing studio calendar...</p>
              </div>
            ) : filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const { date, time } = formatSessionTime(session.start_time);
                const isProcessing = processingId === session.id && bookingLoading;
                const isFull = session.spots_remaining === 0;
                
                return (
                  <div key={session.id} className="bg-white p-6 rounded-[24px] border border-line flex flex-col sm:flex-row sm:items-center justify-between group hover:border-orange transition-all gap-4 text-left">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        {/* Using session.class_name from your backend */}
                        <p className="text-black font-bold text-xl">{session.class_name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-orange font-bold">With {session.instructor_name}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-[11px] text-lightbrown font-medium">
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-orange"/> {date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange"/> {time}</span>
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-orange"/> {session.spots_remaining} / {session.capacity} spots left</span>
                      </div>
                    </div>
                    <button 
                      disabled={isFull}
                      onClick={() => handleBookingClick(session.id)}
                      className={`w-full sm:w-auto px-6 py-3 rounded-[12px] text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${
                        isFull 
                        ? 'bg-greybeige text-lightbrown cursor-not-allowed' 
                        : 'bg-brown text-white hover:bg-orange'
                      }`}
                    >
                      {isProcessing ? (
                          <Loader2 className="animate-spin" size={16} /> // Requirement 2: Spinner
                        ) : isFull ? (
                          'Class Full'
                        ) : (
                          'Reserve Mat'
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center space-y-4 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-greybeige rounded-full flex items-center justify-center mx-auto">
                  <SearchX className="text-lightbrown/40" size={30} />
                </div>
                <div className="space-y-1">
                  <p className="text-black font-medium">No {activeFilter} sessions found</p>
                  <p className="text-lightbrown text-xs px-10">We don't have any classes scheduled for this category right now. Try another filter!</p>
                </div>
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ScheduleModal;
