import { useEffect, useState } from 'react';

interface DaySchedule {
  day: string;
  areas: Array<{ name: string; postcode: string }>;
  postcodes: string[];
  label: string;
}

interface WeekData {
  week: number;
  days: DaySchedule[];
}

export default function Schedule() {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekResults: WeekData[] = [
          { week: 1, days: [] },
          { week: 2, days: [] },
        ];

        // Fetch all days for both weeks in parallel
        const requests = [];
        for (const weekNum of [1, 2]) {
          for (const day of days) {
            requests.push(
              fetch(`/api/areas-by-day?day=${day}&week=${weekNum}`)
                .then(r => r.ok ? r.json() : null)
                .then(data => ({ weekNum, day, data }))
            );
          }
        }

        const results = await Promise.all(requests);

        for (const { weekNum, data } of results) {
          if (data?.available) {
            weekResults[weekNum - 1].days.push({
              day: data.day,
              areas: data.areas || [],
              postcodes: data.postcodes || [],
              label: data.label || '',
            });
          }
        }

        setWeeks(weekResults);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Unable to load schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
        Rob's Gardens — Service Schedule
      </h1>
      <p className="text-muted-foreground mb-10">
        Our 2-week rotating schedule. Call +61 468 170 318 for bookings or special requests.
      </p>

      {weeks.map((weekData) => (
        <div key={weekData.week} className="mb-12">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
            Week {weekData.week}
          </h2>

          {weekData.days.length === 0 ? (
            <p className="text-muted-foreground italic">No service days scheduled for this week.</p>
          ) : (
            <div className="grid gap-4">
              {weekData.days.map((dayData) => (
                <div
                  key={`${weekData.week}-${dayData.day}`}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-semibold text-lg text-foreground">{dayData.day}</h3>
                    <span className="text-sm text-muted-foreground">{dayData.label}</span>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Service Areas:</h4>
                    <ul className="space-y-1">
                      {dayData.areas.map((area) => (
                        <li key={`${area.name}-${area.postcode}`} className="text-sm text-foreground">
                          {area.name} ({area.postcode})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Postcodes:</h4>
                    <p className="text-sm text-foreground">{dayData.postcodes.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mt-10 bg-primary/5 rounded-xl border border-primary/10 p-6">
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Ready to Book?</h3>
        <p className="text-muted-foreground">
          To schedule a service, call us at <strong>+61 468 170 318</strong> or visit our website.
        </p>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
