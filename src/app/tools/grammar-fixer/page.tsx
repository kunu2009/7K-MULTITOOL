
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Clipboard, FileDiff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fixGrammar } from '@/ai/flows/grammar-fixer';
import { type GrammarFixerOutput } from '@/ai/flows/grammar-fixer';
import { useToast } from '@/hooks/use-toast';
import { diffChars } from 'diff';

type State = {
  data: GrammarFixerOutput | null;
  message: string | null;
};

const initialState: State = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      {pending ? 'Fixing...' : 'Fix Grammar & Typos'}
    </Button>
  );
}

export default function GrammarFixerPage() {
  const [state, setState] = React.useState<State>(initialState);
  const [originalText, setOriginalText] = React.useState('');
  const { toast } = useToast();

  const formAction = async (formData: FormData) => {
    const text = formData.get('text') as string;
    setOriginalText(text);

    if (!text || text.length < 5) {
      setState({ data: null, message: 'Please enter at least 5 characters.' });
      return;
    }

    try {
      const result = await fixGrammar({ text });
      setState({ data: result, message: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setState({ data: null, message: `An error occurred: ${errorMessage}` });
    }
  };
  
  const handleCopy = () => {
    if (state.data?.correctedText) {
      navigator.clipboard.writeText(state.data.correctedText);
      toast({ title: 'Copied to clipboard' });
    }
  };
  
  const differences = React.useMemo(() => {
    if (!state.data) return [];
    return diffChars(originalText, state.data.correctedText);
  }, [originalText, state.data]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Grammar & Typos Fixer</CardTitle>
          <CardDescription>Paste text to automatically correct spelling and grammar mistakes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="text">Text to Correct</Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Enter your text here..."
                className="mt-1 min-h-[200px]"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.message && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.data && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Corrected Text</CardTitle>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap font-mono">
             {differences.map((part, index) => {
              const color = part.added ? 'bg-green-500/30' : part.removed ? 'bg-red-500/30 text-red-500 line-through' : 'transparent';
              return (
                <span key={index} className={color}>
                  {part.value}
                </span>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
