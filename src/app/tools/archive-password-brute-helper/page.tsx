
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ListRestart, ShieldQuestion, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function ArchivePasswordBruteHelperPage() {
  const [wordlist, setWordlist] = React.useState('password\n123456\nqwerty\nsecret\nadmin');
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [result, setResult] = React.useState<{ found: boolean; password?: string } | null>(null);
  const { toast } = useToast();

  const handleSimulation = () => {
    const words = wordlist.split('\n').filter(Boolean);
    if (words.length === 0) {
      toast({ title: 'Wordlist is empty', variant: 'destructive' });
      return;
    }
    
    setIsSimulating(true);
    setProgress(0);
    setResult(null);

    const correctPassword = words[Math.floor(Math.random() * words.length)];
    const totalWords = words.length;
    let checkedWords = 0;

    const interval = setInterval(() => {
      checkedWords++;
      const currentProgress = (checkedWords / totalWords) * 100;
      setProgress(currentProgress);
      
      if (words[checkedWords - 1] === correctPassword) {
        clearInterval(interval);
        setResult({ found: true, password: correctPassword });
        setIsSimulating(false);
        toast({ title: 'Password "found"!' });
      } else if (checkedWords >= totalWords) {
        clearInterval(interval);
        setResult({ found: false });
        setIsSimulating(false);
        toast({ title: 'Password not in wordlist.', variant: 'destructive' });
      }
    }, 200); // Simulate trying 5 passwords per second
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListRestart /> Archive Password Brute Helper</CardTitle>
          <CardDescription>An educational tool to demonstrate how wordlist-based password recovery works.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wordlist">Password Wordlist (one per line)</Label>
            <Textarea 
              id="wordlist" 
              value={wordlist}
              onChange={e => setWordlist(e.target.value)}
              className="min-h-[200px] font-mono"
              placeholder="Enter potential passwords here..."
            />
          </div>
          <Button onClick={handleSimulation} disabled={isSimulating}>
            {isSimulating ? <Loader2 className="mr-2 animate-spin" /> : <ListRestart className="mr-2" />}
            {isSimulating ? 'Simulating...' : 'Start Recovery Simulation'}
          </Button>
          
          {isSimulating && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">Trying passwords... {Math.round(progress)}%</p>
            </div>
          )}

          {result && (
            <Alert variant={result.found ? 'default' : 'destructive'} className={result.found ? 'bg-green-50 border-green-200' : ''}>
              {result.found ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.found ? 'Simulation Successful!' : 'Simulation Failed'}</AlertTitle>
              <AlertDescription>
                {result.found ? `The "correct" password was found: ` : 'The password was not in your wordlist.'}
                {result.found && <strong className="font-mono">{result.password}</strong>}
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
      <Alert>
        <ShieldQuestion className="h-4 w-4" />
        <AlertTitle>This is an Educational Simulation</AlertTitle>
        <AlertDescription>
          This tool does NOT attempt to crack any real files. It simulates the process to teach you about password strength and the importance of using non-dictionary words. The "correct" password is randomly selected from your own list for demonstration purposes.
        </AlertDescription>
      </Alert>
      <LegalDisclaimer />
    </div>
  );
}
