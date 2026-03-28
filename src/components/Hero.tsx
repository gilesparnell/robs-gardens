import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Leaf, Mic } from 'lucide-react';
import heroImage from '@/assets/hero-garden.jpg';
import { generateServiceAreaText } from '@/lib/serviceAreaHelper';
import initialZones from '../../data/zones.json';

import type { RotatingSchedule } from '../../types/schedule';

const features = [
  { icon: Star, text: '5-Star Rated' },
  { icon: Shield, text: 'Fully Insured' },
  { icon: Leaf, text: 'Eco-Friendly' },
];

export const Hero = () => {
  const [serviceAreaText, setServiceAreaText] = useState('Servicing Northern Beaches & Greater Sydney, NSW');

  useEffect(() => {
    const data = initialZones as RotatingSchedule;
    const allZones = data.weeks.flatMap(w => w.zones);
    const text = generateServiceAreaText(allZones);
    setServiceAreaText(`Servicing ${text}`);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful garden landscape maintained by Rob Gardening and Maintenance"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-primary-foreground/90">{serviceAreaText}</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              The Art of
              <br />
              <span className="italic">Green Care</span>
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
              3 dedicated teams delivering expert garden maintenance, specialising in pre-sale property makeovers, and complete outdoor transformations.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a href="#contact">
                <Button variant="accent" size="xl">
                  Get Free Quote
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#services">
                <Button variant="heroOutline" size="xl">
                  Our Services
                </Button>
              </a>

              {/* AI Orb Prompt */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-3 ml-2"
              >
                <div className="relative">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-orb-primary flex items-center justify-center cursor-pointer shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => {
                      // Find and click the GHL chat button in shadow DOM
                      const allElements = document.querySelectorAll('*');
                      for (const el of allElements) {
                        if (el.shadowRoot) {
                          const shadowButton = el.shadowRoot?.querySelector('button[id*="lc_text-widget"]');
                          if (shadowButton) {
                            (shadowButton as HTMLButtonElement).click();
                            return;
                          }
                        }
                      }
                    }}
                  >
                    <span className="absolute inset-0 rounded-full bg-orb-primary animate-ping opacity-30" />
                    <Mic className="w-5 h-5 text-primary-foreground relative z-10" />
                  </motion.div>
                </div>
                <div className="text-primary-foreground/90 text-sm max-w-[140px]">
                  <p className="font-medium">Chat with Tom</p>
                  <p className="text-xs text-primary-foreground/70">AI assistant • Instant answers</p>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 text-primary-foreground/80"
                >
                  <feature.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
