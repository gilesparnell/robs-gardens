import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Basic Care',
    description: 'Perfect for small gardens',
    price: 75,
    frequency: 'per visit',
    features: [
      'Lawn mowing & edging',
      'Basic hedge trimming',
      'Green waste removal',
      'Up to 200m² garden',
    ],
    popular: false,
  },
  {
    name: 'Premium Care',
    description: 'Our most popular package',
    price: 150,
    frequency: 'per visit',
    features: [
      'Everything in Basic',
      'Detailed hedge shaping',
      'Garden bed maintenance',
      'Plant health check',
      'Up to 500m² garden',
      'Priority booking',
    ],
    popular: true,
  },
  {
    name: 'Estate Care',
    description: 'Complete garden management',
    price: 300,
    frequency: 'per visit',
    features: [
      'Everything in Premium',
      'Tree trimming & pruning',
      'Irrigation check',
      'Seasonal planting advice',
      'Unlimited garden size',
      'Same-day service',
    ],
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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
            Choose the package that fits your garden. All prices are starting rates and may vary based on garden condition.
          </p>
        </motion.div>

        {/* Pricing Cards */}
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
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.frequency}</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.popular ? 'hero' : 'outline'} 
                    className="w-full"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mt-12 text-sm"
        >
          * Prices are indicative. Contact us for a personalized quote based on your specific needs.
        </motion.p>
      </div>
    </section>
  );
};
