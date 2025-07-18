'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = React.useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      toast({ title: 'Invalid JSON', description: 'The input string is not valid JSON.', variant: 'destructive' });
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
    } catch (e) {
      toast({ title: 'Invalid JSON', description: 'The input string is not valid JSON.', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    setJsonInput('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON Formatter / Beautifier</CardTitle>
        <CardDescription>Format or minify your JSON data for better readability or smaller size.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="json-input">JSON Input</Label>
            <Textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your JSON here'
              className="min-h-[300px] font-mono mt-1"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleFormat}>Beautify / Format</Button>
            <Button onClick={handleMinify} variant="outline">Minify</Button>
            <Button onClick={handleClear} variant="ghost">Clear</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
