import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ['About', 'Classes', 'Pricing', 'Contact'];

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-line px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="font-serif text-2xl text-black">nia pilates</a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-md text-lightbrown hover:text-orange transition-colors">
              {link}
            </a>
          ))}
          <button className="bg-brown text-white py-[10px] px-[20px] rounded-[10px] hover:bg-lightbrown transition-all">
            Book a class
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button className="md:hidden text-lightbrown" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-line flex flex-col p-6 gap-4 shadow-xl animate-in slide-in-from-top">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`} 
              onClick={() => setIsOpen(false)}
              className="text-md text-lightbrown"
            >
              {link}
            </a>
          ))}
          <button className="bg-brown text-white py-[10px] px-[20px] rounded-[10px] w-full">
            Book a class
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;