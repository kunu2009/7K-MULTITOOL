
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const timezones = [
  'UTC', 'GMT', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'
];

export default function TimezoneConverterPage() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedTime = (tz: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(currentTime);
  };
  
   const getFormattedDate = (tz: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(currentTime);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timezone Converter</CardTitle>
        <CardDescription>View the current time in different timezones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {timezones.map(tz => (
          <div key={tz} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div>
                <p className="font-semibold">{tz.replace('_', ' ').split('/').pop()}</p>
                <p className="text-sm text-muted-foreground">{getFormattedDate(tz)}</p>
            </div>
            <p className="font-mono text-2xl">{getFormattedTime(tz)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
