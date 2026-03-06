import heroImage from '../../src/assets/hero-studio.jpg';
import { ChevronRight, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      className="relative h-[100vh] flex items-center justify-center px-6 md:px-12"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <style>
        {`
          @keyframes bounce-more {
            0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
            50% { transform: translateY(30%); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
          }
          .animate-bounce-more {
            animation: bounce-more 1.2s infinite;
          }
        `}
      </style>

      <div className="max-w-4xl space-y-6 mt-16">
        {/* Small Tagline */}
        <p className="text-beige uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold text-[12px] md:text-sm">
          Nairobi's Premier Pilates Studio
        </p>

        {/* Main Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-7xl text-white leading-tight md:leading-[1.1]">
          Move with intention, <br /> 
          live with purpose
        </h1>

        {/* Subtext */}
        <p className="text-white/90 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
          Discover the transformative power of pilates in the heart of Nairobi. 
          Reformer, mat, and barre classes designed for every body.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button className="bg-orange text-white py-[10px] px-[20px] rounded-[10px] font-medium flex items-center gap-2 hover:bg-orange/90 transition-all border border-orange">
            View Pricing
            <ArrowRight size={18} />
          </button>
          
          <button className="bg-transparent text-white border border-white py-[10px] px-[20px] rounded-[10px] font-medium hover:bg-white/10 transition-all">
            Learn more
          </button>
        </div>
      </div>

      {/* Optional: Subtle Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-[26px] h-[40px] border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce"></div>
        </div>
        <span className="text-[10px] text-white/50 uppercase tracking-widest">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
