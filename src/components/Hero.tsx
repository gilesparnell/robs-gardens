import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Leaf, Mic } from 'lucide-react';
import heroImage from '@/assets/hero-garden.jpg';

const features = [
  { icon: Star, text: '5-Star Rated' },
  { icon: Shield, text: 'Fully Insured' },
  { icon: Leaf, text: 'Eco-Friendly' },
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Beautiful garden landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-primary-foreground/90">Servicing Northern Beaches & Palm Beach NSW</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              The Art of
              <br />
              <span className="italic">Green Care</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
              Specializing in trimming & maintenance. From garden care to cleanups and repairs,
              we take great pride in transforming outdoor spaces.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Button variant="accent" size="xl">
                Get Free Quote
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                View Our Work
              </Button>

              {/* AI Orb Prompt - Widget */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-3 ml-2"
              >
                <div className="relative">
                  {/* Pulsing orb */}
                  <motion.div
                    className="w-12 h-12 rounded-full bg-orb-primary flex items-center justify-center cursor-pointer shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => {
                      const orbButton = document.querySelector('[aria-label="Open AI assistant"]') as HTMLButtonElement;
                      if (orbButton) orbButton.click();
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

            {/* Trust Badges */}
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

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
