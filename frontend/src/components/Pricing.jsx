import { Check } from "lucide-react";
import siteData from '../components/data.json';

const Pricing = () => {
  const { pricing } = siteData;

  const highlightedPlan = "Monthly"

  return (
    <section className="py-12 md:py-24 px-6 md:px-12 lg:px-24 bg-beige">
      <div className="max-w-7xl mx-auto text-center space-y-10 md:space-y-14">
        
        {/* Header Content */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold text-[10px] md:text-sm">
            PRICING
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl text-black leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-btext text-sm md:text-lg leading-relaxed font-light">
            Choose the plan that fits your lifestyle. All plans include access to our beautiful Nairobi studio and world-class equipment.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-10 items-stretch">
          {pricing.map((plan) => {
            const isPopular = plan.name === highlightedPlan;

            return (
              <div 
                key={plan.id} 
                className={`relative bg-white p-8 rounded-[20px] flex flex-col border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${
                  isPopular ? 'border-orange ring-1 ring-orange' : 'border-line shadow-sm'
                }`}
              >
                {/* Popular Badge - Rectangular edges with slight radius */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange text-white text-[10px] font-bold uppercase tracking-widest py-2 px-6 rounded-[8px] whitespace-nowrap shadow-md">
                    Most Popular
                  </div>
                )}

                {/* Title & Description */}
                <div className="mb-8">
                  <h3 className="font-serif text-2xl text-black mb-2">{plan.name}</h3>
                  <p className="text-lightbrown text-xs leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 flex flex-col">
                  <span className="text-black font-serif text-3xl md:text-4xl">
                    KSh {plan.price}
                  </span>
                  <span className="text-lightbrown text-[10px] uppercase tracking-wider mt-1">
                    {plan.validity}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-10 flex-grow text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-btext text-sm">
                      <Check size={16} className="text-orange shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button className={`w-full py-[12px] px-[20px] rounded-[10px] font-medium transition-all duration-300 ${
                  isPopular 
                  ? 'bg-orange text-white hover:bg-brown' 
                  : 'bg-brown text-white hover:bg-orange'
                }`}>
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Pricing;
