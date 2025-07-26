'use client';

import * as React from 'react';
import { useActionState, useFormStatus } from 'react-dom';
import { generateLoremIpsumAction, LoremIpsumState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Clipboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const initialState: LoremIpsumState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
      {pending ? 'Generating...' : 'Generate Text'}
    </Button>
  );
}

export default function LoremIpsumGeneratorPage() {
  const [state, formAction] = useActionState(generateLoremIpsumAction, initialState);
  const { toast } = useToast();

  const handleCopy = () => {
    if (state.data?.text) {
      navigator.clipboard.writeText(state.data.text);
      toast({
        title: 'Copied to Clipboard',
        description: 'The generated text has been copied.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lorem Ipsum Generator</CardTitle>
          <CardDescription>Generate placeholder text for your designs and layouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paragraphs">Number of Paragraphs</Label>
                <Input id="paragraphs" name="paragraphs" type="number" defaultValue="5" min="1" max="20" required />
                {state.fieldErrors?.paragraphs && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.paragraphs.join(', ')}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="wordsPerParagraph">Words Per Paragraph (approx.)</Label>
                <Input id="wordsPerParagraph" name="wordsPerParagraph" type="number" defaultValue="50" min="10" max="200" required />
                {state.fieldErrors?.wordsPerParagraph && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.wordsPerParagraph.join(', ')}</p>}
              </div>
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
              <CardTitle>Generated Text</CardTitle>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Clipboard className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 rounded-md border p-4 bg-muted">
              <div className="whitespace-pre-wrap text-muted-foreground space-y-4">
                {state.data.text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
