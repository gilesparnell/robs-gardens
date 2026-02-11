import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initClient, signIn, listUpcomingEvents, createEvent } from '@/lib/googleCalendar';
import { toast } from 'sonner';

// Assuming this is the calendar ID for availability checks (public readout)
// Users will book on their own calendar and invite this email.
const ADMIN_CALENDAR_ID = import.meta.env.VITE_ADMIN_CALENDAR_ID || 'admin@awe2m8.com';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Availability = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);

  // Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    initClient((authorized) => {
      setIsGapiLoaded(true);
      fetchEvents(authorized);
    });
  }, []);

  useEffect(() => {
    if (isGapiLoaded) {
      // We pass true/false based on current auth, but fetching public calendar might work without auth if using API Key
      const authInstance = window.gapi.auth2.getAuthInstance();
      fetchEvents(authInstance.isSignedIn.get());
    }
  }, [currentMonth, currentYear]);

  const fetchEvents = async (authorized: boolean) => {
    setIsLoading(true);
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    try {
      // If we are authorized, we can see details. If not, we rely on public visibility or just don't show specific blocks yet
      // Ideally we use API Key for public calendar read
      const fetchedEvents = await listUpcomingEvents(ADMIN_CALENDAR_ID, firstDay, lastDay);
      setEvents(fetchedEvents || []);
    } catch (e) {
      console.warn("Could not fetch events", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getDayStatus = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();

    // Weekends closed (example rule)
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'booked';

    const dayEvents = events.filter((event) => {
      const start = event.start.dateTime || event.start.date;
      const eventDate = new Date(start);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });

    // Determine status based on load
    // Simple heuristic: > 4 hours = booked
    let totalDurationMs = 0;
    dayEvents.forEach((event) => {
      const start = new Date(event.start.dateTime || event.start.date).getTime();
      const end = new Date(event.end.dateTime || event.end.date).getTime();
      totalDurationMs += (end - start);
    });
    const hours = totalDurationMs / (1000 * 60 * 60);

    if (hours >= 6) return 'booked';
    if (hours > 0) return 'limited';
    return 'available';
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    status: getDayStatus(i + 1),
  }));

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer';
      case 'limited':
        return 'bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground cursor-pointer';
      case 'booked':
        return 'bg-muted text-muted-foreground cursor-not-allowed';
      default:
        return 'bg-muted text-muted-foreground cursor-not-allowed';
    }
  };

  const handleBookClick = () => {
    setIsBookingOpen(true);
  };

  const confirmBooking = async () => {
    setIsBooking(true);
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      // Construct event
      const date = new Date(currentYear, currentMonth, selectedDate!);
      const [hours, minutes] = bookingTime.split(':').map(Number);

      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0);

      const endTime = new Date(startTime);
      endTime.setHours(hours + 1, minutes, 0);

      const event = {
        summary: `Garden Service - ${bookingName}`,
        description: `${bookingNotes}\n\nClient Phone: ${bookingPhone}\nClient Name: ${bookingName}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [
          { email: ADMIN_CALENDAR_ID }
        ]
      };

      // Create event on USER's primary calendar
      await createEvent('primary', event);

      toast.success("Booking Request Sent!", {
        description: "An invitation has been sent to our calendar."
      });

      setIsBookingOpen(false);
      // Reset form
      setBookingName('');
      setBookingPhone('');
      setBookingNotes('');
      setBookingTime('');
      setSelectedDate(null);

      // Refresh availability
      fetchEvents(true);

    } catch (error) {
      console.error("Booking error", error);
      toast.error("Booking Failed", {
        description: "Please permit popups for Google Sign-In or check your connection."
      });
    } finally {
      setIsBooking(false);
    }
  };

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  return (
    <section id="availability" className="py-24 bg-gradient-nature">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Book Now</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Check Availability
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select a date below to book a service. We mainly operate Monday - Friday in the Northern Beaches area.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-elevated p-6 md:p-8">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={goToPrevMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                {months[currentMonth]} {currentYear}
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before the 1st */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => day.status !== 'booked' && setSelectedDate(day.date)}
                  disabled={day.status === 'booked'}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${getStatusStyles(day.status)} ${selectedDate === day.date ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  {day.date}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/10" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-accent/10" />
                <span className="text-sm text-muted-foreground">Limited Slots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted" />
                <span className="text-sm text-muted-foreground">Fully Booked / Closed</span>
              </div>
            </div>

            {/* Selected Date Action */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-primary/5 rounded-xl text-center"
              >
                <p className="text-foreground mb-3">
                  You selected <strong>{months[currentMonth]} {selectedDate}, {currentYear}</strong>
                </p>
                <Button variant="default" size="lg" onClick={handleBookClick}>
                  Book Appointment
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              For {months[currentMonth]} {selectedDate}, {currentYear}. Use your Google Account to send us an invite.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Desired Time</Label>
              <Select onValueChange={setBookingTime} value={bookingTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder="Full Name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} placeholder="Wait, we need to know who you are" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Details about your garden..." />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmBooking} disabled={isBooking || !bookingTime || !bookingName}>
              {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isBooking ? 'Booking...' : 'Sign In with Google & Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
