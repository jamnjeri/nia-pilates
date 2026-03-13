import { Loader2, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const PaymentOverlay = ({ onClose }) => {
  const { paymentStatus, receipt, packageName, error } = useSelector((state) => state.payments);

  if (paymentStatus === 'idle') return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      
      <div className="relative bg-white w-full max-w-sm rounded-[32px] p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        {paymentStatus === 'awaiting_pin' && (
          <>
            <div className="w-20 h-20 bg-orange/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="animate-spin text-orange" size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-black">Check your phone</h3>
              <p className="text-lightbrown text-sm leading-relaxed text-center">
                We've sent an M-Pesa prompt to your device. Please enter your PIN to authorize the payment.
              </p>
            </div>
            <button onClick={onClose} className="text-lightbrown text-[10px] uppercase tracking-widest font-bold hover:text-black transition-colors">
              Cancel
            </button>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="text-green-600" size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-black">Payment Confirmed!</h3>
              <p className="text-lightbrown text-xs">
                You are now subscribed to the <span className="font-bold text-black">{packageName}</span>.
              </p>
              <div className="mt-4 p-3 bg-greybeige rounded-xl border border-line/50">
                <p className="text-[9px] uppercase tracking-widest text-lightbrown font-bold mb-1">M-Pesa Receipt</p>
                <p className="font-mono text-sm text-brown font-bold">{receipt}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-brown text-white py-4 rounded-[16px] font-bold uppercase tracking-widest text-xs hover:bg-orange transition-all shadow-md"
            >
              Start Booking
            </button>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="text-red-500" size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-black">Payment Failed</h3>
              <p className="text-lightbrown text-sm">{error || "The transaction was declined or timed out."}</p>
            </div>
            <button onClick={onClose} className="w-full bg-greybeige text-black py-4 rounded-[16px] font-bold uppercase tracking-widest text-xs">
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentOverlay;

