
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { summarizeTextAction, SummarizerState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, BookMinus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: SummarizerState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookMinus className="mr-2 h-4 w-4" />}
      {pending ? 'Summarizing...' : 'Summarize Text'}
    </Button>
  );
}

export default function SummarizerPage() {
  const [state, setState] = React.useState<SummarizerState>(initialState);

  const formAction = async (formData: FormData) => {
    const result = await summarizeTextAction(initialState, formData);
    setState(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Text Summarizer</CardTitle>
          <CardDescription>Paste a long text or URL to get a concise summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="text">Text or URL</Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Paste your long text or a URL to an article..."
                className="mt-1 min-h-[250px]"
                required
              />
              {state.fieldErrors?.text && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.text.join(', ')}</p>}
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

      {state.data?.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{state.data.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
