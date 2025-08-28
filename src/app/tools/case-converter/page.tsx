
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2 } from 'lucide-react';

export default function CaseConverterPage() {
  const [text, setText] = React.useState('');
  const { toast } = useToast();

  const toSentenceCase = () => {
    setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));
  };

  const toLowerCase = () => setText(text.toLowerCase());
  const toUpperCase = () => setText(text.toUpperCase());
  
  const toTitleCase = () => {
      setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()));
  };
  
  const toAlternatingCase = () => {
      setText(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };
  
  const handleClear = () => {
    setText('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Converter</CardTitle>
        <CardDescription>Convert your text into different case formats.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="text-input">Your Text</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[250px] mt-1"
            placeholder="Paste your text here..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
            <Button onClick={toSentenceCase}>Sentence case</Button>
            <Button onClick={toLowerCase}>lowercase</Button>
            <Button onClick={toUpperCase}>UPPERCASE</Button>
            <Button onClick={toTitleCase}>Title Case</Button>
            <Button onClick={toAlternatingCase}>aLtErNaTiNg cAsE</Button>
        </div>
         <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={!text}><Copy className="mr-2"/>Copy</Button>
            <Button variant="ghost" onClick={handleClear} disabled={!text}><Trash2 className="mr-2"/>Clear</Button>
        </div>
      </CardContent>
    </Card>
  );
}
