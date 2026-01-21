import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Simulated availability data (in real app, this would come from a backend)
const generateAvailability = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: { date: number; status: 'available' | 'limited' | 'booked' }[] = [];
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayOfWeek = new Date(year, month, i).getDay();
    // Weekends are always booked, some weekdays are limited
    if (dayOfWeek === 0) {
      days.push({ date: i, status: 'booked' });
    } else if (dayOfWeek === 6 || Math.random() > 0.7) {
      days.push({ date: i, status: 'limited' });
    } else {
      days.push({ date: i, status: 'available' });
    }
  }
  
  return { firstDay, days };
};

export const Availability = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const { firstDay, days } = generateAvailability(currentYear, currentMonth);
  const startDayOfWeek = firstDay.getDay();

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

  const getStatusStyles = (status: 'available' | 'limited' | 'booked') => {
    switch (status) {
      case 'available':
        return 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer';
      case 'limited':
        return 'bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground cursor-pointer';
      case 'booked':
        return 'bg-muted text-muted-foreground cursor-not-allowed';
    }
  };

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
            View our calendar and find a time that works for you. We service the Northern Beaches area Monday to Saturday.
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
              <h3 className="font-serif text-2xl font-semibold text-foreground">
                {months[currentMonth]} {currentYear}
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
                <span className="text-sm text-muted-foreground">Fully Booked</span>
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
                <Button variant="hero" size="lg">
                  Book This Date
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
