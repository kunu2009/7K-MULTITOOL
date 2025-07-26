'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    <div className="space-y-6">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About URL Encoding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is URL Encoding?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">URL encoding, also known as percent-encoding, is a mechanism for converting characters into a format that can be safely transmitted over the internet. URLs can only be sent using the ASCII character-set. Since URLs often contain characters outside the ASCII set, the URL must be converted so it only contains valid ASCII characters. </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-it-works">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">URL encoding replaces unsafe ASCII characters with a &quot;%&quot; followed by two hexadecimal digits that represent the character's ASCII value. For example, a space character (&quot; &quot;) is encoded as &quot;%20&quot;, and a pound sign (&quot;#&quot;) is encoded as &quot;%23&quot;.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-use-it">
              <AccordionTrigger>Why is it useful?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Passing Data in URLs:</strong> It's essential for sending data in URL query parameters, especially when dealing with user input that might contain special characters.</li>
                    <li><strong>Ensuring URL Validity:</strong> It guarantees that the URL structure remains intact and is correctly interpreted by web servers and browsers.</li>
                    <li><strong>Security:</strong> Proper encoding helps prevent certain types of web vulnerabilities like Cross-Site Scripting (XSS) by ensuring that special characters in user input are treated as data, not as executable code.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <LegalDisclaimer />
    </div>
  );
}
