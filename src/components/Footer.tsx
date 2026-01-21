import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-serif text-lg font-bold">R</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold leading-tight">
                  Rob Gardens
                </h3>
                <p className="text-xs text-primary-foreground/70">& Maintenance</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              The Art of Green Care. Specializing in trimming & maintenance for the Northern Beaches community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Services', 'Pricing', 'Availability', 'Testimonials', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {['Lawn Care & Mowing', 'Hedge Trimming', 'Tree Pruning', 'Garden Cleanups', 'Green Waste Removal'].map((service) => (
                <li key={service}>
                  <span className="text-sm text-primary-foreground/70">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-foreground/70" />
                <a href="tel:+61400000000" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  0400 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-foreground/70" />
                <a href="mailto:info@robgardens.com.au" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  info@robgardens.com.au
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-foreground/70" />
                <span className="text-sm text-primary-foreground/70">Northern Beaches, NSW</span>
              </li>
            </ul>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/robgardensandmaintenance/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} Rob Gardens & Maintenance. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
