
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

export default function PomodoroTimerPage() {
  const [mode, setMode] = React.useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = React.useState(WORK_TIME);
  const [isActive, setIsActive] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev > 0) return prev - 1;
          
          if (mode === 'work') {
            setMode('break');
            return BREAK_TIME;
          } else {
            setMode('work');
            return WORK_TIME;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
  };
  
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
  }
  
  const progress = (mode === 'work' ? (WORK_TIME - timeLeft) / WORK_TIME : (BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
        <CardDescription>Focus for 25 minutes, then take a 5-minute break.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className={`text-center font-bold py-2 px-4 rounded-full ${mode === 'work' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-600'}`}>
          {mode === 'work' ? 'Focus Time' : 'Break Time'}
        </div>
        
        <div className="relative">
          <div className="font-mono text-8xl tracking-tighter">{formatTime(timeLeft)}</div>
        </div>
        
        <div className="w-full space-y-2">
            <Progress value={progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>0:00</span>
                <span>{mode === 'work' ? '25:00' : '05:00'}</span>
            </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={toggleTimer} size="lg" className="w-32">
            {isActive ? <><Pause className="mr-2"/>Pause</> : <><Play className="mr-2"/>Start</>}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="mr-2"/>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
