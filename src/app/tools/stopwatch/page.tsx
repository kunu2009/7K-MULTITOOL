
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function StopwatchPage() {
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stopwatch</CardTitle>
        <CardDescription>A simple stopwatch to measure time intervals.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="font-mono text-7xl md:text-8xl tracking-tighter">
          {formatTime(time)}
        </div>
        <Separator />
        <div className="flex gap-4">
          <Button onClick={() => setIsRunning(!isRunning)} size="lg" className="w-24">
            {isRunning ? <><Pause className="mr-2"/>Pause</> : <><Play className="mr-2"/>Start</>}
          </Button>
          <Button onClick={() => { setTime(0); setIsRunning(false); }} variant="outline" size="lg">
            <RotateCcw className="mr-2"/>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
