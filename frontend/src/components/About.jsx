import aboutImage from "../assets/pilates-woman.jpg";

const About = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-beige overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Side: Image (Top on Mobile) */}
        <div className="order-1 lg:order-1">
          <div className="relative">
            <img 
              src={aboutImage} 
              alt="Woman practicing Pilates" 
              className="rounded-[20px] shadow-xl w-full object-cover h-[400px] md:h-[600px] lg:h-[800px] transition-all duration-500"
            />
            {/* Optional Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="order-2 lg:order-2 space-y-6 md:space-y-8">
          {/* 1. Tagline */}
          <p className="text-orange uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold text-xs md:text-sm">
            OUR STORY
          </p>

          {/* 2. Main Heading */}
          <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl text-black leading-tight">
            Where tradition meets <br className="hidden md:block" /> modern movement
          </h2>

          {/* 3. Description Paragraphs */}
          <div className="space-y-6 text-btext text-sm md:text-lg leading-relaxed font-light">
            <p>
              nia pilates was born from a simple belief: that mindful movement can transform lives. 
              Located in the heart of Nairobi, our studio combines world-class equipment with 
              expert instructors to create a space where you can reconnect with your body.
            </p>
            <p className="pt-2">
              <span className="font-semibold text-brown">"Nia"</span> means purpose or intention. 
              A reminder that every movement has meaning, and every body deserves to feel 
              strong and centered.
            </p>
          </div>

          {/* 4. Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-line">
            <StatItem number="8+" label="Years of Experience" />
            <StatItem number="2k+" label="Happy Members" />
            <StatItem number="15" label="Expert Instructors" />
          </div>
        </div>

      </div>
    </section>
  );
};

const StatItem = ({ number, label }) => (
  <div className="flex flex-col gap-1">
    <span className="font-serif text-2xl md:text-4xl text-black">{number}</span>
    <span className="text-[9px] md:text-xs tracking-wider text-lightbrown leading-tight">
      {label}
    </span>
  </div>
);


export default About;
