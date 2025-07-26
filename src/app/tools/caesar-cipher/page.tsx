'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Key, HelpCircle } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function applyCaesarCipher(text: string, shift: number): string {
  const normalizedShift = ((shift % 26) + 26) % 26; // Ensure shift is positive and within 0-25
  if (normalizedShift === 0) return text;

  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    // Uppercase letters
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65);
    } 
    // Lowercase letters
    else if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + normalizedShift) % 26) + 97);
    }
    // Not a letter, return as is
    return char;
  }).join('');
}


export default function CaesarCipherPage() {
  const [inputText, setInputText] = React.useState('');
  const [outputText, setOutputText] = React.useState('');
  const [shift, setShift] = React.useState([13]);

  const handleEncrypt = () => {
    setOutputText(applyCaesarCipher(inputText, shift[0]));
  };

  const handleDecrypt = () => {
    setOutputText(applyCaesarCipher(inputText, -shift[0]));
  };
  
  const handleSwap = () => {
      setInputText(outputText);
      setOutputText(inputText);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Key className="h-6 w-6" /> Caesar Cipher</CardTitle>
          <CardDescription>Encrypt or decrypt messages using a simple substitution cipher.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input-text">Input Text</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to transform"
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Label htmlFor="shift-slider" className="whitespace-nowrap">Shift: {shift[0]}</Label>
                <Slider
                    id="shift-slider"
                    min={1}
                    max={25}
                    step={1}
                    value={shift}
                    onValueChange={setShift}
                />
            </div>
            <div className="flex flex-wrap gap-2">
                <Button onClick={handleEncrypt}>Encrypt</Button>
                <Button onClick={handleDecrypt} variant="outline">Decrypt</Button>
                <Button onClick={handleSwap} variant="ghost">Swap</Button>
            </div>
          </div>

           <div className="space-y-2">
            <Label htmlFor="output-text">Output Text</Label>
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              placeholder="Result will appear here"
              className="min-h-[150px] bg-muted"
            />
          </div>

        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About the Caesar Cipher
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is a Caesar Cipher?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">The Caesar cipher is one of the earliest known and simplest methods of encryption. It's a type of substitution cipher where each letter in the plaintext is 'shifted' a certain number of places down the alphabet. For example, with a shift of 3, 'A' would become 'D', 'B' would become 'E', and so on.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-it-works">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">The transformation is represented by aligning two alphabets; the cipher alphabet is the plain alphabet rotated left or right by some number of positions. To decrypt a message, you simply apply the reverse shift. While simple to implement, it's highly insecure as there are only 25 possible shifts to try, making it easy to break with brute-force attacks.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="rot13">
              <AccordionTrigger>What is ROT13?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">ROT13 ("rotate by 13 places") is a special case of the Caesar cipher where the shift is 13. The advantage of ROT13 is that it's its own inverse: applying the same ROT13 transformation again restores the original text. It's often used in online forums to hide spoilers, puzzle solutions, or offensive material from a casual glance, but it offers no real cryptographic security.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <LegalDisclaimer />
    </div>
  );
}
