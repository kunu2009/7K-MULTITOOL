
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Wand2 } from 'lucide-react';

// Basic stubs for JWT creation. In a real scenario, you'd use a robust library like 'jose'.
// These functions are for demonstration and do not implement real cryptography.
function base64UrlEncode(str: string) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createJwt(header: object, payload: object, secret: string): string {
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    // THIS IS A FAKE SIGNATURE FOR DEMONSTRATION. DO NOT USE IN PRODUCTION.
    const signature = base64UrlEncode(`fake-signature-of(${encodedHeader}.${encodedPayload})-with-secret-${secret}`);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export default function JwtBuilderPage() {
  const [header, setHeader] = React.useState(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2));
  const [payload, setPayload] = React.useState(JSON.stringify({ sub: '1234567890', name: 'John Doe', iat: Math.floor(Date.now() / 1000) }, null, 2));
  const [secret, setSecret] = React.useState('your-256-bit-secret');
  const [generatedToken, setGeneratedToken] = React.useState('');
  const { toast } = useToast();


  const handleGenerate = () => {
    try {
        const headerObj = JSON.parse(header);
        const payloadObj = JSON.parse(payload);
        const token = createJwt(headerObj, payloadObj, secret);
        setGeneratedToken(token);
        toast({ title: 'JWT Generated (Demo)' });
    } catch (e) {
        toast({ title: 'Invalid JSON', description: 'Please check your header and payload JSON.', variant: 'destructive' });
    }
  };

  const handleCopy = () => {
      if(generatedToken) {
          navigator.clipboard.writeText(generatedToken);
          toast({ title: 'Copied to clipboard'});
      }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JWT Builder & Decoder</CardTitle>
          <CardDescription>Create and decode JSON Web Tokens. The signature is for demonstration only and is not cryptographically secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="header">Header</Label>
                    <Textarea id="header" value={header} onChange={e => setHeader(e.target.value)} className="font-mono h-32"/>
                </div>
                 <div>
                    <Label htmlFor="payload">Payload</Label>
                    <Textarea id="payload" value={payload} onChange={e => setPayload(e.target.value)} className="font-mono h-32"/>
                </div>
            </div>
            <div>
                <Label htmlFor="secret">Secret (for HMAC signatures)</Label>
                <Input id="secret" value={secret} onChange={e => setSecret(e.target.value)} className="font-mono"/>
            </div>
             <Button onClick={handleGenerate}><Wand2 className="mr-2"/> Generate Token</Button>
        </CardContent>
      </Card>
      
      {generatedToken && (
        <Card>
          <CardHeader>
            <CardTitle>Generated JWT</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative">
                <Textarea value={generatedToken} readOnly className="font-mono min-h-[120px] bg-muted pr-12"/>
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}><Copy/></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
