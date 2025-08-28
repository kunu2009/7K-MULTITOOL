
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const IdeaOutputSchema = z.object({
  idea: z.string().describe("A single, creative, and concise idea."),
  description: z.string().describe("A one or two sentence description expanding on the idea."),
});
type IdeaOutput = z.infer<typeof IdeaOutputSchema>;

export default function RandomIdeaGeneratorPage() {
  const [item, setItem] = React.useState<IdeaOutput | null>(null);
  const [topic, setTopic] = React.useState('a new mobile app');
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchItem = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const prompt = ai.definePrompt({
        name: 'ideaGeneratorPrompt',
        input: { schema: z.object({ topic: z.string() }) },
        output: { schema: IdeaOutputSchema },
        prompt: `Generate a single, creative, and interesting brainstorming idea about the following topic: {{{topic}}}.`,
      });

      const { output } = await prompt({ topic });
      if(output) setItem(output);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  React.useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Random Idea Generator</CardTitle>
        <CardDescription>Get a random idea to spark your creativity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="topic-input">Idea Topic</Label>
            <Input id="topic-input" value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
        <div className="p-6 min-h-[150px] flex flex-col items-center justify-center text-center bg-secondary rounded-lg">
            {isLoading && <p>Thinking...</p>}
            {!isLoading && item && (
                <>
                  <Lightbulb className="h-8 w-8 mb-4 text-yellow-500" />
                  <p className="text-xl font-semibold">{item.idea}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </>
            )}
        </div>
        <Button onClick={fetchItem} disabled={isLoading} className="w-full">
          <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Generate New Idea
        </Button>
      </CardContent>
    </Card>
  );
}
