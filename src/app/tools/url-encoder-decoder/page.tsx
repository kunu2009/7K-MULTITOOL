'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

export default function UrlEncoderDecoderPage() {
  const [decodedText, setDecodedText] = React.useState('');
  const [encodedText, setEncodedText] = React.useState('');

  const handleEncode = () => {
    try {
      if(decodedText) setEncodedText(encodeURIComponent(decodedText));
    } catch (e) {
      toast({ title: 'Encoding Error', description: 'Invalid input for URL encoding.', variant: 'destructive' });
    }
  };

  const handleDecode = () => {
    try {
      if(encodedText) setDecodedText(decodeURIComponent(encodedText));
    } catch (e) {
      toast({ title: 'Decoding Error', description: 'Invalid URL encoded string.', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Encoder / Decoder</CardTitle>
        <CardDescription>Encode or decode URL components.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-2">
            <Label htmlFor="decoded-text">Decoded</Label>
            <Textarea
              id="decoded-text"
              value={decodedText}
              onChange={(e) => setDecodedText(e.target.value)}
              placeholder="Enter text to encode"
              className="min-h-[200px]"
            />
          </div>
          <div className="flex flex-col gap-2 my-4 md:my-0">
            <Button onClick={handleEncode} size="icon" aria-label="Encode">
                <ArrowLeftRight className="h-4 w-4 -scale-x-100" />
            </Button>
            <Button onClick={handleDecode} size="icon" variant="outline" aria-label="Decode">
                 <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="encoded-text">Encoded</Label>
            <Textarea
              id="encoded-text"
              value={encodedText}
              onChange={(e) => setEncodedText(e.target.value)}
              placeholder="Enter encoded URL"
              className="min-h-[200px] font-mono"
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
             <Button onClick={() => { setDecodedText(''); setEncodedText(''); }}>Clear</Button>
        </div>
        <LegalDisclaimer />
      </CardContent>
    </Card>
  );
}
