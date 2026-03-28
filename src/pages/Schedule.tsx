import { useEffect, useState } from 'react';

interface DaySchedule {
  day: string;
  areas: Array<{ area: string; postcode: string }>;
  postcodes: string[];
  label: string;
}

export default function Schedule() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const scheduleData: DaySchedule[] = [];

        for (const day of days) {
          const response = await fetch(
            `/api/areas-by-day?day=${day}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.available) {
              scheduleData.push({
                day: data.day,
                areas: data.areas || [],
                postcodes: data.postcodes || [],
                label: data.label || '',
              });
            }
          }
        }

        setSchedule(scheduleData);
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
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Loading schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Rob's Gardens - Service Schedule</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Current service areas by day. Call +61 468 170 318 for bookings or special requests.
      </p>

      {schedule.length === 0 ? (
        <p>No schedule data available</p>
      ) : (
        <div>
          {schedule.map((dayData) => (
            <div
              key={dayData.day}
              style={{
                marginBottom: '30px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {dayData.day}
              </h2>
              <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                <strong>{dayData.label}</strong>
              </p>

              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>
                  Service Areas:
                </h3>
                <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  {dayData.areas.map((area) => (
                    <li key={`${area.area}-${area.postcode}`}>
                      {area.area} ({area.postcode})
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>
                  Postcodes Covered:
                </h3>
                <p style={{ margin: '0', color: '#666' }}>
                  {dayData.postcodes.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f4f8', borderRadius: '8px' }}>
        <h3>Ready to Book?</h3>
        <p>
          To schedule a service, call us at <strong>+61 468 170 318</strong> or visit our website.
        </p>
      </div>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ddd' }} />
      <p style={{ fontSize: '12px', color: '#999', margin: '20px 0 0 0' }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
