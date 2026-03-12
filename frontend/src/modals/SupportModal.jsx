import { X, Mail, Phone, MessageCircle } from "lucide-react";

const SupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-[24px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        <button onClick={onClose} className="absolute right-6 top-6 text-lightbrown hover:text-black">
          <X size={20} />
        </button>

        <h3 className="font-serif text-2xl text-black mb-2">Need Help?</h3>
        <p className="text-lightbrown text-sm mb-8">Our team typically responds within 2 hours during studio hours.</p>

        <div className="space-y-4">
          <a href="https://wa.me/254791404571" className="flex items-center gap-4 p-4 bg-green-50 rounded-[16px] border border-green-100 group hover:bg-green-100 transition-colors">
            <div className="bg-green-500 p-2 rounded-lg text-white"><MessageCircle size={20} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">WhatsApp</p>
              <p className="text-sm font-medium">+254 xxx xxx xxx</p>
            </div>
          </a>

          <a href="mailto:hello@niapilates.co.ke" className="flex items-center gap-4 p-4 bg-orange/5 rounded-[16px] border border-orange/10 group hover:bg-orange/10 transition-colors">
            <div className="bg-orange p-2 rounded-lg text-white"><Mail size={20} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange">Email Support</p>
              <p className="text-sm font-medium">hello@niapilates.co.ke</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
export default SupportModal;
