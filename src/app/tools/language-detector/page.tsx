
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { detectLanguageAction, LanguageDetectorState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Languages } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: LanguageDetectorState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
      {pending ? 'Detecting...' : 'Detect Language'}
    </Button>
  );
}

export default function LanguageDetectorPage() {
  const [state, setState] = React.useState<LanguageDetectorState>(initialState);

  const formAction = async (formData: FormData) => {
    const result = await detectLanguageAction(initialState, formData);
    setState(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Language Detector</CardTitle>
          <CardDescription>Automatically detect the language of a piece of text.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="text">Text to Analyze</Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Paste text here..."
                className="mt-1 min-h-[200px]"
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

      {state.data && (
        <Card>
          <CardHeader>
            <CardTitle>Detection Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg">Detected Language:</p>
            <p className="text-3xl font-bold text-primary">{state.data.language}</p>
            <p className="text-muted-foreground">(Confidence: {state.data.confidence.toFixed(2)}%)</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
