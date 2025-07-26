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
    <div className="space-y-6">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About Base64 Encoding
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is Base64 Encoding?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation. It's designed to carry data stored in binary formats across channels that only reliably support text content.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-it-works">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">The encoding process takes 24 bits (3 bytes) of binary data and represents them as four 6-bit Base64 digits. The character set used for these digits consists of 64 ASCII characters: `A-Z`, `a-z`, `0-9`, `+`, and `/`. If the input data is not a multiple of 3 bytes, padding (`=`) is added to the end.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-use-it">
              <AccordionTrigger>Why is it useful?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Data URIs:</strong> Base64 is commonly used to embed binary data, like images or fonts, directly into HTML or CSS files using `data:` URIs.</li>
                    <li><strong>Email Attachments:</strong> It's used in the MIME (Multipurpose Internet Mail Extensions) standard to attach files to emails.</li>
                    <li><strong>APIs:</strong> Web APIs often use Base64 to transmit binary data within JSON or XML payloads, which are text-based formats.</li>
                    <li><strong>Obfuscation:</strong> While not a form of encryption, it can obscure data from casual observation, for instance, in basic HTTP authentication.</li>
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
