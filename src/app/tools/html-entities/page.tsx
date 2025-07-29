
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, HelpCircle, CodeXml } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper functions are now defined outside and before the component.
const encodeEntities = (text: string) => {
  // This check is necessary to prevent errors during server-side rendering,
  // though for client components it's mainly a safeguard.
  if (typeof document === 'undefined') return '';
  const element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
};

const decodeEntities = (text: string) => {
  if (typeof document === 'undefined') return '';
  const element = document.createElement('textarea');
  element.innerHTML = text;
  return element.value;
};

export default function HtmlEntitiesPage() {
  const [decodedText, setDecodedText] = React.useState('');
  const [encodedText, setEncodedText] = React.useState('');

  const handleEncode = () => {
    try {
      if(decodedText) setEncodedText(encodeEntities(decodedText));
    } catch (e) {
      toast({ title: 'Encoding Error', description: 'Could not encode the provided text.', variant: 'destructive' });
    }
  };

  const handleDecode = () => {
    try {
      if(encodedText) setDecodedText(decodeEntities(encodedText));
    } catch (e) {
      toast({ title: 'Decoding Error', description: 'Could not decode the provided entities.', variant: 'destructive' });
    }
  };
  
  const handleSwap = () => {
    setDecodedText(encodedText);
    setEncodedText(decodedText);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CodeXml className="h-6 w-6" /> HTML Entities</CardTitle>
          <CardDescription>Encode or decode special characters to and from their HTML entity equivalent.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="decoded-text">Decoded Text</Label>
              <Textarea
                id="decoded-text"
                value={decodedText}
                onChange={(e) => setDecodedText(e.target.value)}
                placeholder="e.g., <h1>Hello World!</h1>"
                className="min-h-[200px] font-mono"
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
              <Label htmlFor="encoded-text">Encoded Entities</Label>
              <Textarea
                id="encoded-text"
                value={encodedText}
                onChange={(e) => setEncodedText(e.target.value)}
                placeholder="e.g., &lt;h1&gt;Hello World!&lt;/h1&gt;"
                className="min-h-[200px] font-mono"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4 gap-2">
              <Button onClick={() => { setDecodedText(''); setEncodedText(''); }}>Clear</Button>
              <Button onClick={handleSwap} variant="ghost">Swap</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About HTML Entities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What are HTML Entities?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">An HTML entity is a piece of text ("string") that begins with an ampersand (`&`) and ends with a semicolon (`;`). Entities are frequently used to display reserved characters (which would otherwise be interpreted as HTML code), and for characters that are not easily typed on a standard keyboard.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-it-works">
              <AccordionTrigger>How do they work?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">When a browser encounters an HTML entity, it replaces it with the character it represents. For example, the entity `&lt;` is rendered as the less-than sign (`<`), and `&copy;` is rendered as the copyright symbol (`©`). This prevents the browser from interpreting the `<` as the start of a tag.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-use-it">
              <AccordionTrigger>Why is this useful?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Displaying Code:</strong> To show HTML, XML, or other code snippets on a webpage without the browser trying to render the code itself.</li>
                    <li><strong>Reserved Characters:</strong> To safely display characters that have special meaning in HTML, like `<`, `>`, `&`, and `"`.</li>
                    <li><strong>Special Symbols:</strong> To easily insert characters that are not on your keyboard, such as copyright (`&copy;`), trademark (`&trade;`), or currency symbols (`&euro;`, `&yen;`).</li>
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
