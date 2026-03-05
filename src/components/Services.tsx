import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors, TreeDeciduous, Flower2, Recycle, Droplets, Sparkles, Sun } from 'lucide-react';

const services = [
  {
    icon: Scissors,
    title: 'Lawn Care & Mowing',
    description: 'Professional lawn mowing, edging and maintenance to keep your grass healthy and pristine.',
  },
  {
    icon: TreeDeciduous,
    title: 'Hedge Trimming',
    description: 'Precise hedge trimming and shaping to create stunning boundaries and defined garden features.',
  },
  {
    icon: Flower2,
    title: 'Pruning & Weeding',
    description: 'Expert pruning, weeding and plant care to keep your garden thriving and beautiful year-round.',
  },
  {
    icon: Sun,
    title: 'Seasonal Garden Care',
    description: 'End-of-winter mulching, spring new growth prep, and year-round seasonal maintenance programs.',
  },
  {
    icon: Recycle,
    title: 'Green Waste & Clearing',
    description: 'Complete garden cleanup, clearing and environmentally responsible green waste disposal.',
  },
  {
    icon: Droplets,
    title: 'Hard Surface Cleaning',
    description: 'Waterblasting patios, paths and driveways to restore them to their original clean finish.',
  },
  {
    icon: Sparkles,
    title: 'Garden Makeovers',
    description: 'New planting, mulching, repairs and complete garden transformations to revitalise your outdoor space.',
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From routine maintenance to complete garden transformations, our 3 dedicated teams provide comprehensive care for homes, strata, business parks and aged care estates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="group h-full bg-card hover:shadow-elevated transition-all duration-300 border-border hover:border-primary/30 overflow-hidden">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
