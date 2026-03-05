import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Home, Sparkles } from 'lucide-react';
import presalesImage from '@/assets/presales-garden.jpg';

const presalesFeatures = [
  'Lawn mowing & edging for picture-perfect curb appeal',
  'Pruning & hedge shaping to frame the property',
  'Weeding & garden bed preparation',
  'Fresh mulching for a clean, finished look',
  'Complete blow-outs of all areas',
  'Waterblasting patios, paths & driveways',
  'Clearing of overgrown or neglected areas',
  'New planting to add colour and life',
  'Fence & garden repairs',
];

export const PreSalesService = () => {
  return (
    <section id="presales" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={presalesImage}
              alt="Beautifully prepared home garden ready for sale with fresh mulch, trimmed hedges and clean driveway"
              className="rounded-2xl shadow-elevated w-full object-cover aspect-video"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground rounded-xl px-5 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span className="font-semibold text-sm">Selling Agent Favourite</span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Pre-Sale Specialist</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pre-Sale Property<br />Clean Up Service
            </h2>

            <p className="text-muted-foreground text-lg mb-6">
              First impressions sell homes. Our dedicated teams transform outdoor spaces to maximise
              your property&apos;s street appeal — whether it&apos;s a one-off blitz or ongoing maintenance
              throughout your entire sale campaign.
            </p>

            <p className="text-sm text-muted-foreground mb-6 bg-muted/50 rounded-lg p-3">
              <strong>Typical projects:</strong> 3–4 days for a full property makeover. We tailor scope and crew size to your timeline and budget. Packages from approx. $4,000–$5,000.
            </p>

            <ul className="space-y-3 mb-8">
              {presalesFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <a href="#contact">
                <Button variant="hero" size="lg">
                  Get a Pre-Sale Quote
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="tel:+61468170318">
                <Button variant="outline" size="lg">
                  Call 0468 170 318
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
