
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { Loader2, BrainCircuit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PuzzleOutputSchema = z.object({
  title: z.string().describe("A catchy title for the puzzle or riddle."),
  puzzle: z.string().describe("The puzzle, riddle, or brain teaser itself."),
  answer: z.string().describe("The solution to the puzzle."),
});
type PuzzleOutput = z.infer<typeof PuzzleOutputSchema>;

export default function PuzzleGeneratorPage() {
  const [puzzle, setPuzzle] = React.useState<PuzzleOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState('easy');

  const fetchPuzzle = React.useCallback(async () => {
    setIsLoading(true);
    setPuzzle(null);
    setShowAnswer(false);
    try {
      const prompt = ai.definePrompt({
        name: 'puzzlePrompt',
        input: { schema: z.object({ difficulty: z.string() }) },
        output: { schema: PuzzleOutputSchema },
        prompt: `Generate a single, fun, and clever {{{difficulty}}} brain teaser, logic puzzle, or riddle.`,
      });

      const { output } = await prompt({ difficulty });
      if(output) setPuzzle(output);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);
  
  React.useEffect(() => {
    fetchPuzzle();
  }, [fetchPuzzle])

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Puzzle & Brain Teaser Generator</CardTitle>
        <CardDescription>Generate a unique puzzle or riddle to test your wits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
            <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
            </Select>
             <Button onClick={fetchPuzzle} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <BrainCircuit className="mr-2" />}
                New Puzzle
            </Button>
        </div>
        
        <Card className="min-h-[250px] p-6 flex flex-col justify-center items-center text-center bg-secondary">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
          {!isLoading && puzzle && (
            <>
              <h3 className="text-lg font-semibold">{puzzle.title}</h3>
              <p className="mt-4 text-xl">{puzzle.puzzle}</p>
            </>
          )}
        </Card>

        {puzzle && (
          <div className="text-center">
            <Button onClick={() => setShowAnswer(!showAnswer)} variant="outline">
              {showAnswer ? 'Hide' : 'Show'} Answer
            </Button>
            {showAnswer && (
              <p className="mt-4 p-4 bg-muted rounded-md font-semibold text-primary">
                {puzzle.answer}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
