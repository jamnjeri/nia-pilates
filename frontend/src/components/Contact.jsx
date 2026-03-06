import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactDetails = [
  {
    id: 1,
    icon: <MapPin size={24} />,
    title: "Location",
    line1: "4th Floor, Westlands Tower",
    line2: "Waiyaki Way, Nairobi",
  },
  {
    id: 2,
    icon: <Phone size={24} />,
    title: "Phone",
    line1: "+254 700 123 456",
    line2: "+254 733 987 654",
  },
  {
    id: 3,
    icon: <Mail size={24} />,
    title: "Email",
    line1: "hello@asalipilates.co.ke",
    line2: "bookings@asalipilates.co.ke",
  },
  {
    id: 4,
    icon: <Clock size={24} />,
    title: "Hours",
    line1: "Mon - Fri: 6:00 AM - 8:00 PM",
    line2: "Sat - Sun: 7:00 AM - 4:00 PM",
  }
];

const Contact = () => {
  return (
    <section className="py-12 md:py-24 px-6 md:px-12 lg:px-24 bg-greybeige">
      <div className="max-w-7xl mx-auto text-center space-y-10 md:space-y-14">
        
        {/* Header Content */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-orange uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold text-[10px] md:text-sm">
            CONTACT
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl text-black leading-tight">
            Visit our studio
          </h2>
          <p className="text-btext text-sm md:text-lg leading-relaxed font-light">
            We'd love to welcome you. Drop by for a tour or reach out with any questions.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {contactDetails.map((item) => (
            <div 
              key={item.id} 
              className="bg-beige p-8 rounded-[20px] shadow-sm border border-line flex flex-col items-center text-center transition-all duration-300 hover:shadow-md"
            >
              {/* Icon Box - 10% Orange Opacity */}
              <div className="bg-orange/10 p-4 rounded-[15px] mb-6 text-orange">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl text-black mb-4">
                {item.title}
              </h3>

              {/* Info Lines */}
              <div className="space-y-1">
                <p className="text-btext text-sm leading-relaxed whitespace-nowrap">
                  {item.line1}
                </p>
                <p className="text-btext text-sm leading-relaxed whitespace-nowrap">
                  {item.line2}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Contact;
