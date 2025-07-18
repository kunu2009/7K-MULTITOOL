'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

export default function Base64Page() {
  const [plainText, setPlainText] = React.useState('');
  const [base64Text, setBase64Text] = React.useState('');

  const handleEncode = () => {
    try {
      if(plainText) setBase64Text(btoa(unescape(encodeURIComponent(plainText))));
    } catch (e) {
      toast({ title: 'Encoding Error', description: 'Invalid input for Base64 encoding.', variant: 'destructive' });
    }
  };

  const handleDecode = () => {
    try {
      if(base64Text) setPlainText(decodeURIComponent(escape(atob(base64Text))));
    } catch (e) {
      toast({ title: 'Decoding Error', description: 'Invalid Base64 string.', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base64 Encoder / Decoder</CardTitle>
        <CardDescription>Encode text to Base64 or decode a Base64 string back to text.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-2">
            <Label htmlFor="plain-text">Plain Text</Label>
            <Textarea
              id="plain-text"
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Enter plain text"
              className="min-h-[200px]"
            />
          </div>
          <div className="flex flex-col gap-2 my-4 md:my-0">
            <Button onClick={handleEncode} size="icon" aria-label="Encode to Base64">
                <ArrowLeftRight className="h-4 w-4 -scale-x-100" />
            </Button>
            <Button onClick={handleDecode} size="icon" variant="outline" aria-label="Decode from Base64">
                 <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="base64-text">Base64</Label>
            <Textarea
              id="base64-text"
              value={base64Text}
              onChange={(e) => setBase64Text(e.target.value)}
              placeholder="Enter Base64 string"
              className="min-h-[200px] font-mono"
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
             <Button onClick={() => { setPlainText(''); setBase64Text(''); }}>Clear</Button>
        </div>
        <LegalDisclaimer />
      </CardContent>
    </Card>
  );
}
