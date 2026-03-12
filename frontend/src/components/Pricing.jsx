import { Check, Loader2 } from "lucide-react";
import siteData from '../components/data.json';
import { useSelector } from "react-redux";

const Pricing = () => {
  const { items, loading } = useSelector((state) => state.packages);

  const highlightedPlan = "Monthly"

  const getValidityText = (days, isUnlimited) => {
    if (days === 365) return "per year";
    if (days === 30) return "per month";
    if (days === 1 && !isUnlimited) return "per class";
    if (days === 90) return "valid 3 months";
    return `valid ${days} days`;
  };

  const formatPlanName = (name) => {
    if (!name) return "";
    return name
      .replace(/[_-]/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-'); 
  };

  return (
    <section id="pricing" className="py-12 md:py-24 px-6 md:px-12 lg:px-24 bg-beige">
      <div className="max-w-7xl mx-auto text-center space-y-10">
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.3em] font-semibold text-[10px] md:text-sm">
            PRICING
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-black leading-tight">
            Simple, transparent pricing
          </h2>
          {loading && (
            <div className="flex items-center justify-center gap-2 text-lightbrown text-xs">
              <Loader2 size={14} className="animate-spin"/> Updating packages...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-10 items-stretch">
          {items.map((plan) => {
            // Match based on uppercase name from backend
            const isPopular = plan.name === highlightedPlan;

            return (
              <div 
                key={plan.id} 
                className={`relative bg-white p-8 rounded-[20px] flex flex-col border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${
                  isPopular ? 'border-orange ring-1 ring-orange' : 'border-line shadow-sm'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange text-white text-[10px] font-bold uppercase tracking-widest py-2 px-6 rounded-[8px] whitespace-nowrap shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-serif text-2xl text-black mb-2 capitalize">
                    {formatPlanName(plan.name.toLowerCase())}
                  </h3>
                  <p className="text-lightbrown text-xs leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex flex-col">
                  <span className="text-black font-serif text-3xl md:text-4xl">
                    {/* Format "170000.00" to "170,000" */}
                    KSh {Number(plan.price).toLocaleString()}
                  </span>
                  <span className="text-lightbrown text-[10px] uppercase tracking-wider mt-1">
                    {getValidityText(plan.duration_days, plan.is_unlimited)}
                  </span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-btext text-sm">
                      <Check size={16} className="text-orange shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

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
