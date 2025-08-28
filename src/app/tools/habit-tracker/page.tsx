
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDays, format, isSameDay, startOfWeek, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

type Habit = {
  id: string;
  name: string;
  completions: string[]; // dates as 'yyyy-MM-dd'
};

export default function HabitTrackerPage() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [newHabit, setNewHabit] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    const savedHabits = localStorage.getItem('habits-data');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem('habits-data', JSON.stringify(newHabits));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    saveHabits([...habits, { id: Date.now().toString(), name: newHabit, completions: [] }]);
    setNewHabit('');
  };
  
  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id));
  };
  
  const toggleCompletion = (habitId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const newHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completions = habit.completions.includes(dateStr)
          ? habit.completions.filter(c => c !== dateStr)
          : [...habit.completions, dateStr];
        return { ...habit, completions };
      }
      return habit;
    });
    saveHabits(newHabits);
  };
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Tracker</CardTitle>
        <CardDescription>Build good habits by tracking your streaks and progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="e.g., Read for 15 minutes"
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <Button onClick={addHabit}><Plus /></Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_repeat(7,minmax(0,1fr))] gap-2 items-center">
            <span className="text-sm font-medium">Habit</span>
            {weekDates.map(date => (
              <div key={date.toString()} className="text-center">
                <p className="text-xs text-muted-foreground">{format(date, 'eee')}</p>
                <p className="font-bold">{format(date, 'd')}</p>
              </div>
            ))}
          </div>
          {habits.map(habit => (
            <div key={habit.id} className="grid grid-cols-[1fr_repeat(7,minmax(0,1fr))] gap-2 items-center p-2 rounded-md hover:bg-secondary">
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteHabit(habit.id)}><Trash2 className="h-4 w-4" /></Button>
                 <span className="truncate">{habit.name}</span>
              </div>
              {weekDates.map(date => {
                const isCompleted = habit.completions.some(c => isSameDay(new Date(c), date));
                return (
                    <div key={`${habit.id}-${date}`} className="flex justify-center">
                        <button 
                            onClick={() => toggleCompletion(habit.id, date)} 
                            className={cn(
                                "h-8 w-8 rounded-md border transition-colors",
                                isCompleted ? "bg-primary border-primary" : "bg-muted hover:bg-muted-foreground/20"
                            )}
                        />
                    </div>
                )
              })}
            </div>
          ))}
          {habits.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Add a habit to get started!</p>}
        </div>
      </CardContent>
    </Card>
  );
}
