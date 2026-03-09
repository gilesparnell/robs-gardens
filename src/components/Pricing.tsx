import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, Star, ArrowRight } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Regular Maintenance',
    description: 'Ongoing garden care',
    price: 150,
    frequency: 'per hour',
    features: [
      'Team of two professionals',
      'Lawn mowing & edging',
      'Hedge trimming & pruning',
      'Weeding & mulching',
      'Green waste removal',
      'Blow-outs included',
    ],
    popular: true,
    note: 'Most homes take 2–4 hours',
  },
  {
    name: 'Pre-Sale Makeover',
    description: 'Get your property sale-ready',
    price: null,
    priceText: '$2K – $4K',
    frequency: 'typical project',
    features: [
      'Full property transformation',
      '3–4 day turnaround typical',
      'Waterblasting & hard surfaces',
      'New planting & mulching',
      'Ongoing campaign maintenance option',
      'Custom quote based on property size',
    ],
    popular: false,
    note: 'Quote determines crew size & scope',
  },
  {
    name: 'Ride-On Mower',
    description: 'Large property solutions',
    price: 200,
    frequency: 'per hour hire',
    features: [
      'Professional ride-on mower',
      'We do it or you hire it',
      'Delivery within 20 miles: $200',
      'Daily rates available',
      'Perfect for acreage & estates',
      'Business parks & aged care',
    ],
    popular: false,
    note: 'Or $150/hr with our team of two',
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Straightforward rates for every job. Get a free quote to determine the right scope for your property.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${plan.popular ? 'border-primary shadow-elevated scale-105' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <h3 className="font-serif text-2xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    {plan.price ? (
                      <>
                        <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                        <span className="text-muted-foreground ml-2">{plan.frequency}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-foreground">{plan.priceText}</span>
                        <span className="text-muted-foreground ml-2 block text-sm mt-1">{plan.frequency}</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-3 mb-6 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.note && (
                    <p className="text-xs text-muted-foreground/70 mb-4 italic">{plan.note}</p>
                  )}
                  <a href="#contact">
                    <Button
                      variant={plan.popular ? 'hero' : 'outline'}
                      className="w-full"
                      size="lg"
                    >
                      Get a Quote
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mt-12 text-sm"
        >
          * All prices are indicative. A free on-site quote will determine the exact scope, crew size, and cost for your property.
        </motion.p>
      </div>
    </section>
  );
};
