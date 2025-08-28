
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Lightbulb, Quote } from 'lucide-react';
import { z } from 'zod';
import { ai } from '@/ai/genkit';

const FactOrQuoteOutputSchema = z.object({
  type: z.enum(['fact', 'quote']),
  content: z.string(),
  source: z.string().optional(),
});
type FactOrQuoteOutput = z.infer<typeof FactOrQuoteOutputSchema>;

export default function RandomFactOrQuotePage() {
  const [item, setItem] = React.useState<FactOrQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchItem = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const prompt = ai.definePrompt({
        name: 'factOrQuotePrompt',
        output: { schema: FactOrQuoteOutputSchema },
        prompt: `Generate either a single interesting random fact or an insightful quote. 
                 Randomly choose between providing a fact or a quote.
                 If it's a quote, provide the author as the source. 
                 If it's a fact, the source can be 'General Knowledge'.`,
      });

      const { output } = await prompt();
      if(output) setItem(output);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Random Fact / Quote of the Day</CardTitle>
        <CardDescription>Get a dose of knowledge or inspiration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 min-h-[150px] flex flex-col items-center justify-center text-center bg-secondary rounded-lg">
            {isLoading && <p>Loading...</p>}
            {!isLoading && item && (
                <>
                  {item.type === 'fact' ? <Lightbulb className="h-8 w-8 mb-4 text-yellow-500" /> : <Quote className="h-8 w-8 mb-4 text-blue-500" />}
                  <p className="text-xl italic">"{item.content}"</p>
                  {item.source && <p className="mt-4 text-sm text-muted-foreground">- {item.source}</p>}
                </>
            )}
        </div>
        <Button onClick={fetchItem} disabled={isLoading} className="w-full">
          <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Get Another
        </Button>
      </CardContent>
    </Card>
  );
}
