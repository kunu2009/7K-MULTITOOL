
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function JsonViewer({ jsonString }: { jsonString: string }) {
  let content;
  try {
    const jsonObject = JSON.parse(jsonString);
    content = JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    content = 'Invalid JSON';
  }
  return <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">{content}</pre>;
}

export default function JwtDecoderPage() {
  const [token, setToken] = React.useState('');
  const [header, setHeader] = React.useState('');
  const [payload, setPayload] = React.useState('');

  const handleDecode = () => {
    if (!token) {
      toast({ title: 'Token is empty', description: 'Please paste a JWT to decode.', variant: 'destructive' });
      return;
    }
    try {
      const [headerPart, payloadPart] = token.split('.');
      if (!headerPart || !payloadPart) {
        throw new Error('Invalid JWT structure');
      }
      setHeader(atob(headerPart.replace(/-/g, '+').replace(/_/g, '/')));
      setPayload(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      toast({ title: 'Decoded successfully' });
    } catch (e) {
      setHeader('');
      setPayload('');
      toast({ title: 'Decoding Error', description: 'Invalid JWT token.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JWT Decoder</CardTitle>
          <CardDescription>Decode a JSON Web Token to view its header and payload.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jwt-input">JWT Token</Label>
            <Textarea
              id="jwt-input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your JWT here"
              className="min-h-[120px] font-mono mt-1"
            />
          </div>
          <Button onClick={handleDecode}>Decode</Button>
        </CardContent>
      </Card>
      
      {header && payload && (
        <Card>
          <CardHeader>
            <CardTitle>Decoded Token</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['header', 'payload']} className="w-full">
              <AccordionItem value="header">
                <AccordionTrigger>Header</AccordionTrigger>
                <AccordionContent>
                  <JsonViewer jsonString={header} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payload">
                <AccordionTrigger>Payload</AccordionTrigger>
                <AccordionContent>
                  <JsonViewer jsonString={payload} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="text-sm text-muted-foreground mt-4">Note: The signature is not verified. This tool only decodes the token.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
