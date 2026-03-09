import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Giles Parnell',
    location: 'Elanora Heights, NSW',
    rating: 5,
    text: 'Rob and his team were beyond amazing. In selling our home, I went from thinking i could do everything myself to realising i was way way over my head. I found Robs website online and was then super impressed that he had a 24/7 virtual receptionist on his site. Every time i called, i got clear updated information on his pricing, his availability and when he was going to arrive. I received text notifications leading up to my appointment. NEXT level service.',
    avatar: null,
  },
  {
    name: 'Sarah Mitchell',
    location: 'Avalon Beach, NSW',
    rating: 5,
    text: "Best garden maintenance service I've ever used. They're reliable, thorough, and my garden has never looked better. The team is always on time and leaves everything spotless.",
    avatar: null,
  },
  {
    name: 'James Thompson',
    location: 'Newport, NSW',
    rating: 5,
    text: 'Incredible transformation of our overgrown backyard. Rob and his team worked efficiently and the results speak for themselves. Fair pricing and excellent communication throughout.',
    avatar: null,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about our services.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-border hover:shadow-medium transition-shadow duration-300">
                <CardContent className="p-6 md:p-8">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-serif text-lg font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
