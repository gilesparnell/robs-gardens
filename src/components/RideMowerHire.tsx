import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Clock, Wrench, ArrowRight } from 'lucide-react';
import rideMowerImage from '@/assets/ride-mower.jpg';

const options = [
  {
    icon: Wrench,
    title: 'We Do It For You',
    description: '1 person of our team drives the mower and handles the job from start to finish.',
    price: '$175',
    note: 'Per service',
  },
  {
    icon: Clock,
    title: 'Dry Hire',
    description: 'Rent out our professional ride-on mower per day and tackle your property at your own pace. Additional costs for delivery and pick up, depending on location.',
    price: '$200/day',
    note: 'Mon–Thu rate',
  },
  {
    icon: Truck,
    title: 'Weekend Hire',
    description: 'Dry hire available Friday through Sunday at weekend rates.',
    price: '$300–$400',
    note: 'Fri–Sun',
  },
];

export const RideMowerHire = () => {
  return (
    <section className="pb-24 pt-8 bg-gradient-nature">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Large Properties</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Ride-On Mower Service
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Got a large lawn? Our professional ride-on mower makes quick work of big properties.
              We can do the job for you, or you can hire it out.
            </p>

            <div className="space-y-4">
              {options.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <option.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-1">
                          <h3 className="font-semibold text-foreground">{option.title}</h3>
                          <span className="text-primary font-bold">{option.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{option.note}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <a href="#contact" className="inline-block mt-6">
              <Button variant="hero" size="lg">
                Enquire About Mower Hire
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={rideMowerImage}
              alt="Professional ride-on lawn mower for large property maintenance"
              className="rounded-2xl shadow-elevated w-full object-cover aspect-video"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
