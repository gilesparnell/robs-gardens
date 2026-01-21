import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors, TreeDeciduous, Flower2, Recycle, Fence, Droplets } from 'lucide-react';

const services = [
  {
    icon: Scissors,
    title: 'Lawn Care & Mowing',
    description: 'Professional lawn mowing, edging, and maintenance to keep your grass healthy and pristine.',
    image: null,
  },
  {
    icon: TreeDeciduous,
    title: 'Elevated Tree Care',
    description: 'Expert tree trimming, pruning, and shaping to enhance the beauty and health of your trees.',
    image: null,
  },
  {
    icon: Flower2,
    title: 'Hedges & Plants',
    description: 'Precise hedge trimming and plant care to create stunning garden boundaries and features.',
    image: null,
  },
  {
    icon: Recycle,
    title: 'Green Waste Removal',
    description: 'Complete garden cleanup and environmentally responsible green waste disposal services.',
    image: null,
  },
  {
    icon: Fence,
    title: 'Garden Repairs',
    description: 'Fence repairs, retaining walls, and general garden maintenance to keep everything in top shape.',
    image: null,
  },
  {
    icon: Droplets,
    title: 'Irrigation Systems',
    description: 'Installation and maintenance of efficient watering systems to keep your garden thriving.',
    image: null,
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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
            From routine maintenance to complete garden transformations, we provide comprehensive care for your outdoor spaces.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
