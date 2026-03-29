import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, Mic } from 'lucide-react';

export const BookingSection = () => {
  const handleOrbClick = () => {
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
  };

  return (
    <section id="book" className="py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Book Now</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Schedule Your Service
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Book online using Tom, the virtual assistant, or call{' '}
            <a href="tel:+61468170318" className="text-primary font-semibold hover:underline">
              +61 468 170 318
            </a>
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
          {/* Chat with Tom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl shadow-elevated border border-border p-8 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Chat with Tom
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Our AI virtual assistant can help you book a service, get a quote, or answer any questions instantly.
            </p>
            <Button variant="hero" size="lg" onClick={handleOrbClick}>
              Start Chat
            </Button>
          </motion.div>

          {/* Call Us */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl shadow-elevated border border-border p-8 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Call Us Direct
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Prefer to speak with someone? Give us a call and we'll get you booked in.
            </p>
            <a href="tel:+61468170318">
              <Button variant="outline" size="lg">
                +61 468 170 318
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
