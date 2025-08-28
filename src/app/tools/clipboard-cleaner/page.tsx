
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Sparkles } from 'lucide-react';

export default function ClipboardCleanerPage() {
  const [text, setText] = React.useState('');
  const { toast } = useToast();

  const handlePasteAndClean = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      await navigator.clipboard.writeText(clipboardText);
      toast({ title: 'Clipboard Cleaned!', description: 'Formatting has been removed from the text on your clipboard.' });
    } catch (err) {
      toast({ title: 'Failed to access clipboard', description: 'Please grant clipboard permissions to this site.', variant: 'destructive'});
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard'});
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Clipboard Format Cleaner</CardTitle>
        <CardDescription>Paste rich text and copy it back as plain text, stripping all formatting like fonts, colors, and links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handlePasteAndClean} className="w-full">
          <Sparkles className="mr-2" />
          Paste & Clean from Clipboard
        </Button>
        <Textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder="Your cleaned, plain text will appear here. You can also paste directly into this box."
          className="min-h-[300px]"
        />
        <Button onClick={handleCopyToClipboard} variant="outline" disabled={!text}>
            <Clipboard className="mr-2" />
            Copy to Clipboard
        </Button>
      </CardContent>
    </Card>
  );
}
