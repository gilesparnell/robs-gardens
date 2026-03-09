import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Home, TrendingUp, DollarSign } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import showcase1 from '@/assets/showcase-1.png';
import showcase2 from '@/assets/showcase-2.png';
import showcase3 from '@/assets/showcase-3.png';
import userHome from '@/assets/roberto-work-home.jpg';

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
    <section id="presales" className="py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 shadow-sm"
            >
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-bold text-foreground mb-2">Maximize ROI</h4>
              <p className="text-sm text-muted-foreground">A well-presented garden can increase property value by up to 10-15%.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 shadow-sm"
            >
              <DollarSign className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-bold text-foreground mb-2">Sell Faster</h4>
              <p className="text-sm text-muted-foreground">Properties with high curb appeal spend 30% less time on the market.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 shadow-sm"
            >
              <Home className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-bold text-foreground mb-2">Agent Approved</h4>
              <p className="text-sm text-muted-foreground">Preferred by top selling agents to ensure listing photos look spectacular.</p>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Pre-Sale Property<br />Makeover Specialist
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <p className="text-muted-foreground text-lg mb-6">
                  First impressions sell homes. Our dedicated teams transform outdoor spaces to maximise
                  your property&apos;s street appeal — whether it&apos;s a one-off blitz or ongoing maintenance
                  throughout your entire sale campaign.
                </p>

                <p className="text-sm text-muted-foreground mb-6 bg-muted/50 rounded-lg p-3 border border-border">
                  <strong>Typical projects:</strong> Obviously depends on your estate size, but usually the team takes between 1 and 3 days to complete a full property makeover. We always tailor scope and crew size to fit your timeline and budget.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
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
              </div>

              <div>
                <ul className="grid sm:grid-cols-1 gap-3">
                  {presalesFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Market Ready Transformations Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="mb-10">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                Market-Ready Transformations
              </h3>
              <p className="text-muted-foreground">
                Look at some of our most recent transformations
              </p>
            </div>

            <div className="relative px-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {[
                    { img: userHome, title: "Lush Oasis Transformation", loc: "Elanora Heights, Northern Beaches" },
                    { img: showcase1, title: "Modern Estate Prep", loc: "St Ives, Upper North Shore" },
                    { img: showcase2, title: "Al Fresco Excellence", loc: "Turramurra, Upper North Shore" },
                    { img: showcase3, title: "Curb Appeal King", loc: "Wahroonga, Upper North Shore" },
                  ].map((item, i) => (
                    <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2">
                      <div className="p-1">
                        <div className="relative overflow-hidden rounded-2xl aspect-[16/10] shadow-xl group">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <p className="text-white font-bold text-xl">{item.title}</p>
                            <p className="text-white/80 text-sm">{item.loc}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </Carousel>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
