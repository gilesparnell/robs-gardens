import { motion } from 'framer-motion';
import { Award, Clock, Users, ThumbsUp, Leaf, Shield } from 'lucide-react';
import garden1 from '@/assets/garden-1.jpg';
import garden2 from '@/assets/garden-2.jpg';
import garden3 from '@/assets/garden-3.jpg';

const reasons = [
  {
    icon: Award,
    title: 'Expert Craftsmanship',
    description: 'Years of experience in landscape and garden maintenance with attention to detail.',
  },
  {
    icon: Clock,
    title: 'Reliable & Punctual',
    description: "We value your time. Expect us when we say we'll be there, every single time.",
  },
  {
    icon: Users,
    title: 'Dedicated Team',
    description: 'Our trained professionals treat your garden with the care it deserves.',
  },
  {
    icon: ThumbsUp,
    title: 'Satisfaction Guaranteed',
    description: "We're not happy until you're happy. Quality service is our promise.",
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Practices',
    description: 'Sustainable methods and responsible waste disposal for a greener future.',
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Complete peace of mind with comprehensive insurance coverage.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-foreground/70 font-medium text-sm uppercase tracking-wider">Why Rob Gardening</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl">
              With a passion for creating beautiful outdoor spaces and a commitment to excellence, 
              we've become the trusted choice for garden maintenance in the Northern Beaches.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                    <reason.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{reason.title}</h3>
                    <p className="text-sm text-primary-foreground/70">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src={garden1}
                  alt="Garden maintenance work"
                  className="rounded-2xl w-full h-48 object-cover shadow-elevated"
                />
                <img
                  src={garden2}
                  alt="Hedge trimming"
                  className="rounded-2xl w-full h-64 object-cover shadow-elevated"
                />
              </div>
              <div className="pt-8">
                <img
                  src={garden3}
                  alt="Lawn mowing results"
                  className="rounded-2xl w-full h-72 object-cover shadow-elevated"
                />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-accent/20 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
