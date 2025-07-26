'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Calculator } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, intervalToDuration } from 'date-fns';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

function AgeDisplayCard({ value, label }: { value?: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-primary/5 border border-primary/10 rounded-lg">
      <p className="text-4xl font-bold text-primary">{value ?? '--'}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = React.useState<Date | undefined>();
  const [age, setAge] = React.useState<{ years?: number; months?: number; days?: number } | null>(null);

  React.useEffect(() => {
    if (birthDate) {
      const duration = intervalToDuration({ start: birthDate, end: new Date() });
      setAge(duration);
    } else {
      setAge(null);
    }
  }, [birthDate]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Age Calculator</CardTitle>
          <CardDescription>Select your date of birth to calculate your current age.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Your Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !birthDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
             <div className="flex items-center mb-4">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-semibold">Your Age Is</h3>
             </div>
            <div className="grid grid-cols-3 gap-4">
              <AgeDisplayCard value={age?.years} label="Years" />
              <AgeDisplayCard value={age?.months} label="Months" />
              <AgeDisplayCard value={age?.days} label="Days" />
            </div>
          </div>
        </CardContent>
      </Card>
      <LegalDisclaimer />
    </div>
  );
}
