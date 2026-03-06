const Footer = () => {
  const quickLinks = ['About', 'Classes', 'Pricing', 'Contact'];
  const socials = ['Instagram', 'Facebook', 'Tiktok'];

  return (
    <footer className="bg-beige border-t border-line pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div>
            <h2 className="font-serif text-2xl text-black mb-4">nia pilates</h2>
            <p className="text-lightbrown leading-relaxed max-w-sm text-sm">
              Nairobi's premier pilates studio. Transforming lives through intentional movement since 2018.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-black mb-4 uppercase text-sm tracking-widest">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-btext hover:text-orange text-sm transition-colors capitalize">
                    {link === 'About' ? 'About Us' : link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-black mb-4 uppercase text-sm tracking-widest">Follow Us</h3>
            <ul className="space-y-2">
              {socials.map((social) => (
                <li key={social}>
                  <a href="#" className="text-btext hover:text-orange text-sm transition-colors">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Line and Row 2 */}
        <div className="border-t border-line pt-8 text-center">
          <p className="text-sm text-lightbrown">
            © 2026 nia pilates. All rights reserved. Nairobi, Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
