import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Mic } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '0468 170 318',
    href: 'tel:+61468170318',
    description: 'Speak directly with our team',
  },
  {
    icon: Mic,
    label: 'Voice AI Assistant',
    value: 'Chat with Tom',
    href: null,
    description: 'Click the orb for instant answers',
    isOrb: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@robgarden.com.au',
    href: 'mailto:info@robgarden.com.au',
    description: 'We reply within 24 hours',
  },
  {
    icon: MessageCircle,
    label: 'Send a Text',
    value: 'SMS 0468 170 318',
    href: 'sms:+61468170318',
    description: 'Quick text message',
  },
  {
    icon: MapPin,
    label: 'Service Area',
    value: 'Northern Beaches & Greater Sydney',
    href: null,
    description: 'Homes, strata, business parks & aged care',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Sat: 7am – 5pm',
    href: null,
    description: 'AI assistant available 24/7',
  },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Quote Request Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleOrbClick = () => {
    const orbButton = document.querySelector('[aria-label="Open AI assistant"]') as HTMLButtonElement;
    if (orbButton) orbButton.click();
  };

  return (
    <section id="contact" className="py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Get In Touch</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Request a Free Quote
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to transform your garden? Reach out any way you prefer — call, text, email or chat with our AI assistant.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((item) => (
              <Card key={item.label} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    {item.isOrb ? (
                      <button
                        onClick={handleOrbClick}
                        className="font-medium text-foreground hover:text-primary transition-colors text-left"
                      >
                        {item.value}
                      </button>
                    ) : item.href ? (
                      <a href={item.href} className="font-medium text-foreground hover:text-primary transition-colors block truncate">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium text-foreground truncate">{item.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground/70">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="bg-card border-border shadow-elevated">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0400 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Tell Us About Your Property
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Describe your property, the services you need, and any timeline requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-32 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Get Free Quote'}
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
