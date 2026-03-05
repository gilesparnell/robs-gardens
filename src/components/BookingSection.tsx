import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarCheck, QrCode } from 'lucide-react';

const GHL_BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/Cmkj9J9vHBQlVwFmxZPC';
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(GHL_BOOKING_URL)}`;

export const BookingSection = () => {
  return (
    <section id="book" className="py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Book Now</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Schedule Your Service
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pick a time that works for you. Book online instantly or scan the QR code from your phone.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
          {/* Booking Calendar Embed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-card rounded-2xl shadow-elevated overflow-hidden border border-border"
          >
            <div className="p-4 bg-primary/5 border-b border-border flex items-center gap-3">
              <CalendarCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Book an Appointment</h3>
            </div>
            <iframe
              src={GHL_BOOKING_URL}
              className="w-full border-0"
              style={{ minHeight: '600px' }}
              title="Book an appointment with Rob Gardening and Maintenance"
              loading="lazy"
            />
          </motion.div>

          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl shadow-elevated border border-border p-8 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Scan to Book
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Use your phone camera to scan this QR code and book an appointment instantly.
            </p>
            <div className="bg-background rounded-xl p-4 inline-block mb-6">
              <img
                src={QR_CODE_URL}
                alt="QR code to book an appointment with Rob Gardening and Maintenance"
                width={200}
                height={200}
                className="mx-auto"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Perfect for sharing with clients & agents
            </p>
            <a
              href={GHL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4"
            >
              <Button variant="outline" size="sm">
                Open Booking Page
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
