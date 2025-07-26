'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

async function generateHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGeneratorPage() {
  const [input, setInput] = React.useState('');
  const [algorithm, setAlgorithm] = React.useState<HashAlgorithm>('SHA-256');
  const [output, setOutput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleGenerate = async () => {
    if (!input) {
        toast({ title: 'Input is empty', description: 'Please enter some text to hash.', variant: 'destructive' });
        return;
    }
    setLoading(true);
    try {
        const hash = await generateHash(input, algorithm);
        setOutput(hash);
    } catch (error) {
        toast({ title: 'Error', description: 'Could not generate hash.', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hash Generator</CardTitle>
          <CardDescription>Generate cryptographic hashes from your text input.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="input-text">Input Text</Label>
              <Textarea
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to hash"
                className="mt-1 min-h-[120px]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="algorithm">Algorithm</Label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as HashAlgorithm)}>
                  <SelectTrigger id="algorithm" className="mt-1">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHA-256">SHA-256</SelectItem>
                    <SelectItem value="SHA-1">SHA-1 (Insecure)</SelectItem>
                    <SelectItem value="SHA-512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="self-end">
                <Button onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate Hash'}</Button>
              </div>
            </div>
            <div>
              <Label htmlFor="output-hash">Generated Hash</Label>
              <Textarea
                id="output-hash"
                value={output}
                readOnly
                placeholder="Hash output will appear here"
                className="mt-1 font-mono min-h-[120px] bg-muted"
              />
            </div>
            <Alert>
              <AlertDescription>
                  MD5 is not supported as it is cryptographically broken and deprecated in modern Web APIs. SHA-1 is also considered insecure and should only be used for legacy compatibility.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About Hashing
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is a Hash Function?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">A cryptographic hash function is a mathematical algorithm that takes an input (or 'message') and returns a fixed-size string of bytes. The output, known as the hash value or digest, is unique to the given input. Even a tiny change in the input will produce a completely different output hash.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="properties">
              <AccordionTrigger>What are the key properties?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Deterministic:</strong> The same input will always produce the same output.</li>
                    <li><strong>One-Way Function:</strong> It is computationally infeasible to reverse the process and find the original input from the hash output. This is why hashing is not encryption.</li>
                    <li><strong>Collision Resistant:</strong> It is extremely difficult to find two different inputs that produce the same hash output.</li>
                    <li><strong>Avalanche Effect:</strong> Any small change to the input data results in a drastically different output hash.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-use-it">
              <AccordionTrigger>Why is it useful?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Password Storage:</strong> Instead of storing passwords in plaintext, websites store their hash. When you log in, the site hashes your entered password and compares it to the stored hash.</li>
                    <li><strong>Data Integrity:</strong> Hashing is used to verify that a file or message has not been altered. By comparing the hash of a file before and after transmission, you can ensure its integrity.</li>
                    <li><strong>Digital Signatures:</strong> Hashing is a core component of digital signatures, which are used to verify the authenticity and integrity of digital documents.</li>
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
