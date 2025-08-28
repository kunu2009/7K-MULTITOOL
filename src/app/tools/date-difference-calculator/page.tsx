
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, intervalToDuration, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';

function ResultCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-primary/5 border border-primary/10 rounded-lg">
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

export default function DateDifferenceCalculatorPage() {
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());
  
  const results = React.useMemo(() => {
    if (!startDate || !endDate) return null;
    
    const duration = intervalToDuration({ start: startDate, end: endDate });
    const days = differenceInDays(endDate, startDate);
    const weeks = differenceInWeeks(endDate, startDate);
    const months = differenceInMonths(endDate, startDate);

    return {
      summary: `${duration.years || 0} years, ${duration.months || 0} months, ${duration.days || 0} days`,
      totalMonths: months,
      totalWeeks: weeks,
      totalDays: days,
    };
  }, [startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Difference Calculator</CardTitle>
        <CardDescription>Calculate the duration between two dates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} /></PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 flex-1">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} /></PopoverContent>
            </Popover>
          </div>
        </div>
        
        {results && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
                <p className="text-lg font-semibold">Difference:</p>
                <p className="text-xl">{results.summary}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultCard value={results.totalMonths.toString()} label="Total Months" />
                <ResultCard value={results.totalWeeks.toString()} label="Total Weeks" />
                <ResultCard value={results.totalDays.toString()} label="Total Days" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
