
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const NumerologyOutputSchema = z.object({
  lifePathNumber: z.number().min(1).max(9).describe("The single-digit Life Path number derived from the name."),
  meaning: z.string().describe("A fun, quirky, and positive interpretation of what this number means for the person's character. About 2-3 sentences."),
  strengths: z.array(z.string()).describe("A list of 3 positive personality traits or strengths associated with this number."),
  challenges: z.array(z.string()).describe("A list of 3 potential challenges or weaknesses associated with this number."),
});
type NumerologyOutput = z.infer<typeof NumerologyOutputSchema>;

export default function NumerologyPage() {
  const [name, setName] = React.useState('');
  const [result, setResult] = React.useState<NumerologyOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchNumerology = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setIsLoading(true);
    setResult(null);
    try {
      const prompt = ai.definePrompt({
        name: 'numerologyPrompt',
        input: { schema: z.object({ name: z.string() }) },
        output: { schema: NumerologyOutputSchema },
        prompt: `You are a fun and modern numerologist. Analyze the name "{{{name}}}" based on Chaldean numerology principles to calculate its Life Path number (a single digit from 1-9). Provide a quirky and positive interpretation of the number's meaning, along with 3 strengths and 3 challenges.`,
      });

      const { output } = await prompt({ name });
      if(output) setResult(output);

    } catch (error) {
      console.error(error);
      // You could set an error state here to show in the UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Name Numerology</CardTitle>
        <CardDescription>Discover the quirky, AI-generated meaning behind your name.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={fetchNumerology} className="flex gap-2">
            <Input 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter a full name"
                required
            />
            <Button type="submit" disabled={isLoading || !name}>
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
                Analyze
            </Button>
        </form>
        
        {result && (
            <Card>
                <CardHeader className="items-center text-center">
                    <CardTitle className="text-6xl text-primary font-bold">{result.lifePathNumber}</CardTitle>
                    <CardDescription>Your Life Path Number</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="italic text-center mb-6">"{result.meaning}"</p>
                     <Accordion type="multiple" defaultValue={['strengths', 'challenges']} className="w-full">
                        <AccordionItem value="strengths">
                            <AccordionTrigger>Strengths</AccordionTrigger>
                            <AccordionContent>
                               <ul className="list-disc pl-5 space-y-1">
                                {result.strengths.map(s => <li key={s}>{s}</li>)}
                               </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="challenges">
                            <AccordionTrigger>Challenges</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-1">
                                {result.challenges.map(c => <li key={c}>{c}</li>)}
                               </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
    </div>
  );
}
