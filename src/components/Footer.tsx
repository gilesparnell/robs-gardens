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
              <img src="/rob-gardens-logo.jpg" alt="Rob's Garden Services" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-serif text-lg font-semibold leading-tight">
                  Rob Gardening
                </h3>
                <p className="text-xs text-primary-foreground/70">& Maintenance</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              The Art of Green Care. 3 dedicated teams servicing homes, strata, business parks and aged care across Greater Sydney, Northern Beaches, Eastern Suburbs, Greater Western Sydney and the Central Coast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Services', 'Pre-Sale', 'Pricing', 'Book Now', 'Testimonials', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '')}`}
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
              {['Pre-Sale Makeovers', 'Lawn Care & Mowing', 'Hedge Trimming', 'Hard Surface Cleaning', 'Ride-On Mower Hire', 'Seasonal Garden Care'].map((service) => (
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
                <a href="tel:+61468170318" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  +61 468 170 318
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-foreground/70" />
                <a href="mailto:info@robgarden.com.au" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  info@robgarden.com.au
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-foreground/70" />
                <span className="text-sm text-primary-foreground/70">Greater Sydney area, Northern Beaches, Eastern Suburbs, Greater Western Sydney, Central Coast</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/rob_gardens?igsh=MXV2YXJlb2lvNHdlYQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1DTAx7wU9h/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            &copy; {currentYear} Rob Gardening &amp; Maintenance. All rights reserved.
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
