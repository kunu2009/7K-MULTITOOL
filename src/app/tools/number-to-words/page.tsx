
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { convertNumberAction, NumberToWordsState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Replace } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Clipboard } from 'lucide-react';

const initialState: NumberToWordsState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Replace className="mr-2 h-4 w-4" />}
      {pending ? 'Converting...' : 'Convert'}
    </Button>
  );
}

export default function NumberToWordsPage() {
  const [state, setState] = React.useState<NumberToWordsState>(initialState);
  const { toast } = useToast();

  const formAction = async (formData: FormData) => {
    const result = await convertNumberAction(initialState, formData);
    setState(result);
  };

  const handleCopy = () => {
    if (state.data?.words) {
      navigator.clipboard.writeText(state.data.words);
      toast({
        title: 'Copied to Clipboard',
        description: 'The converted text has been copied.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Number to Words Converter</CardTitle>
          <CardDescription>Convert any number into its English word equivalent.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                name="number"
                type="number"
                placeholder="e.g., 12345"
                className="mt-1"
                required
              />
              {state.fieldErrors?.number && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.number.join(', ')}</p>}
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
                <CardTitle>Result</CardTitle>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Clipboard className="h-4 w-4" />
                    <span className="sr-only">Copy to clipboard</span>
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium p-4 bg-muted rounded-md capitalize">{state.data.words}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
