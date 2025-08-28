
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Users } from 'lucide-react';

export default function RandomNamePickerPage() {
  const [names, setNames] = React.useState('');
  const [winner, setWinner] = React.useState<string | null>(null);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const { toast } = useToast();

  const handlePickWinner = () => {
    const nameList = names.split('\n').map(n => n.trim()).filter(Boolean);
    if (nameList.length < 2) {
      toast({ title: 'Not enough names', description: 'Please enter at least two names, each on a new line.', variant: 'destructive' });
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * nameList.length);
      setWinner(nameList[randomIndex]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalWinnerIndex = Math.floor(Math.random() * nameList.length);
      const finalWinner = nameList[finalWinnerIndex];
      setWinner(finalWinner);
      setIsSpinning(false);
      toast({ title: 'And the winner is...', description: finalWinner });
    }, 2000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Enter Names</CardTitle>
                <CardDescription>Enter one name per line.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    placeholder="Alice\nBob\nCharlie\n..."
                    className="min-h-[300px]"
                />
                <Button onClick={handlePickWinner} disabled={isSpinning} className="w-full">
                    {isSpinning ? 'Picking...' : 'Pick a Winner'}
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy /> Winner</CardTitle>
                 <CardDescription>The randomly selected winner will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
                <div className="text-4xl font-bold text-center p-8 bg-secondary rounded-lg w-full">
                    {winner || '?'}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
