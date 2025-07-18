'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegexTesterPage() {
  const [regex, setRegex] = React.useState('');
  const [flags, setFlags] = React.useState({ g: true, i: false, m: false });
  const [testString, setTestString] = React.useState('');
  const [highlighted, setHighlighted] = React.useState<React.ReactNode>(testString);

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  React.useEffect(() => {
    if (!regex || !testString) {
      setHighlighted(testString);
      return;
    }

    try {
      const activeFlags = Object.entries(flags)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join('');
      const re = new RegExp(regex, activeFlags);
      
      if (!flags.g) {
          const match = testString.match(re);
          if (match) {
            const index = match.index || 0;
            const matchedText = match[0];
            setHighlighted(
              <>
                {testString.substring(0, index)}
                <mark className="bg-primary/20">{matchedText}</mark>
                {testString.substring(index + matchedText.length)}
              </>
            );
          } else {
            setHighlighted(testString);
          }
      } else {
          const parts = testString.split(re);
          const matches = testString.match(re);
          if (matches) {
            setHighlighted(
              parts.reduce<React.ReactNode[]>((acc, part, i) => {
                if (i < parts.length -1) {
                    return [...acc, part, <mark key={i} className="bg-primary/20">{matches[i]}</mark>];
                }
                return [...acc, part];
              }, [])
            );
          } else {
             setHighlighted(testString);
          }
      }

    } catch (e) {
      setHighlighted(testString);
    }
  }, [regex, flags, testString]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regex Tester</CardTitle>
        <CardDescription>Test your regular expressions against sample text with real-time feedback.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="regex-input">Regular Expression</Label>
              <Input
                id="regex-input"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Enter your regex"
                className="font-mono mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Flags</Label>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="flag-g" checked={flags.g} onCheckedChange={() => handleFlagChange('g')} />
                  <Label htmlFor="flag-g" className="font-mono">g</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="flag-i" checked={flags.i} onCheckedChange={() => handleFlagChange('i')} />
                  <Label htmlFor="flag-i" className="font-mono">i</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="flag-m" checked={flags.m} onCheckedChange={() => handleFlagChange('m')} />
                  <Label htmlFor="flag-m" className="font-mono">m</Label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="test-string">Test String</Label>
            <div className="relative mt-1">
                <Textarea
                    id="test-string"
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Enter string to test regex against"
                    className="min-h-[200px] font-mono bg-transparent"
                />
                <div className="absolute top-0 left-0 p-3.5 whitespace-pre-wrap w-full min-h-[200px] font-mono text-transparent pointer-events-none select-none text-base">
                    {highlighted}
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
