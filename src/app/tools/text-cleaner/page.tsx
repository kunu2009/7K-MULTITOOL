
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TextCleanerPage() {
  const [text, setText] = React.useState('');
  const [options, setOptions] = React.useState({
    removeExtraSpaces: true,
    removeExtraLines: true,
    trimLines: true,
  });
  const { toast } = useToast();

  const handleClean = () => {
    let cleanedText = text;
    if (options.removeExtraSpaces) {
      cleanedText = cleanedText.replace(/ +/g, ' ');
    }
    if (options.removeExtraLines) {
      cleanedText = cleanedText.replace(/\n\s*\n/g, '\n');
    }
    if (options.trimLines) {
      cleanedText = cleanedText.split('\n').map(line => line.trim()).join('\n');
    }
    setText(cleanedText);
    toast({ title: "Text cleaned!" });
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
        <CardTitle>Text Cleaner</CardTitle>
        <CardDescription>Remove extra spaces, lines, and whitespace from your text.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="text-input">Your Text</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] mt-1"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
                <Checkbox id="removeExtraSpaces" checked={options.removeExtraSpaces} onCheckedChange={(checked) => setOptions({...options, removeExtraSpaces: !!checked})} />
                <Label htmlFor="removeExtraSpaces">Remove extra spaces</Label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="removeExtraLines" checked={options.removeExtraLines} onCheckedChange={(checked) => setOptions({...options, removeExtraLines: !!checked})} />
                <Label htmlFor="removeExtraLines">Remove extra lines</Label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="trimLines" checked={options.trimLines} onCheckedChange={(checked) => setOptions({...options, trimLines: !!checked})} />
                <Label htmlFor="trimLines">Trim lines</Label>
            </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleClean}>Clean Text</Button>
            <Button variant="outline" onClick={handleCopy}><Copy className="mr-2"/>Copy</Button>
            <Button variant="ghost" onClick={handleClear}><Trash2 className="mr-2"/>Clear</Button>
        </div>
      </CardContent>
    </Card>
  );
}
