
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Copy } from 'lucide-react';

export default function RandomPasswordGeneratorPage() {
  const [password, setPassword] = React.useState('');
  const [length, setLength] = React.useState([16]);
  const [options, setOptions] = React.useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const { toast } = useToast();

  const generatePassword = React.useCallback(() => {
    const charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?',
    };

    let allChars = '';
    if (options.uppercase) allChars += charSets.uppercase;
    if (options.lowercase) allChars += charSets.lowercase;
    if (options.numbers) allChars += charSets.numbers;
    if (options.symbols) allChars += charSets.symbols;

    if (allChars === '') {
      toast({ title: 'No character types selected', variant: 'destructive' });
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length[0]; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    setPassword(newPassword);
  }, [length, options, toast]);

  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast({ title: 'Password copied to clipboard' });
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Random Password Generator</CardTitle>
        <CardDescription>Create strong, secure, and random passwords.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
            <Input value={password} readOnly className="font-mono text-lg h-12" />
            <Button size="icon" variant="outline" onClick={generatePassword}><RefreshCw /></Button>
            <Button size="icon" onClick={handleCopy}><Copy /></Button>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Length: {length[0]}</Label>
                <Slider value={length} onValueChange={setLength} min={8} max={64} step={1} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="uppercase" checked={options.uppercase} onCheckedChange={(checked) => setOptions({...options, uppercase: !!checked})} />
                    <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="lowercase" checked={options.lowercase} onCheckedChange={(checked) => setOptions({...options, lowercase: !!checked})} />
                    <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="numbers" checked={options.numbers} onCheckedChange={(checked) => setOptions({...options, numbers: !!checked})} />
                    <Label htmlFor="numbers">Numbers (0-9)</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="symbols" checked={options.symbols} onCheckedChange={(checked) => setOptions({...options, symbols: !!checked})} />
                    <Label htmlFor="symbols">Symbols (!@#$...)</Label>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
