import { Flame, Clock, Users } from "lucide-react";
import siteData from "./data";

const Classes = () => {
  const { classes } = siteData
  return (
    <section className="py-12 px-6 md:px-12 lg:px-24 bg-greybeige">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        
        {/* Header Content */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold text-[10px] md:text-sm">
            OUR CLASSES
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl text-black leading-tight">
            Find your perfect practice
          </h2>
          <p className="text-btext text-sm md:text-lg leading-relaxed font-light">
            From reformer to mat, barre to prenatal. We offer a range of classes to suit every body and every goal.
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {classes.map((item) => (
            <div 
              key={item.id} 
              className="bg-beige p-8 rounded-[20px] shadow-sm border border-line flex flex-col items-start text-left hover:shadow-md transition-shadow duration-300"
            >
              {/* Flame Icon Box */}
              <div className="bg-orange/10 p-3 rounded-[12px] mb-6">
                <Flame size={24} className="text-orange fill-orange/20" />
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-xl text-black mb-3">{item.title}</h3>
              <p className="text-lightbrown text-sm leading-relaxed mb-8 flex-grow">
                {item.description}
              </p>

              {/* Icons Row */}
              <div className="space-y-3 w-full border-t border-line pt-6">
                <div className="flex items-center gap-3 text-btext">
                  <Clock size={16} className="text-orange" />
                  <span className="text-xs font-medium uppercase tracking-wider">{item.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-btext">
                  <Users size={16} className="text-orange" />
                  <span className="text-xs font-medium uppercase tracking-wider">{item.capacity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Classes;
