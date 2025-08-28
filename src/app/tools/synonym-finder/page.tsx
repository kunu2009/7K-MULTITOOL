
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Book, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { findSynonyms } from '@/ai/flows/synonym-finder';
import { type SynonymFinderOutput } from '@/ai/flows/synonym-finder';
import { Badge } from '@/components/ui/badge';

type State = {
  data: SynonymFinderOutput | null;
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
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Finding...' : 'Find Synonyms'}
    </Button>
  );
}

export default function SynonymFinderPage() {
  const [state, setState] = React.useState<State>(initialState);

  const formAction = async (formData: FormData) => {
    const word = formData.get('word') as string;
    if (!word || word.length < 2) {
      setState({ data: null, message: 'Please enter a word.' });
      return;
    }

    try {
      const result = await findSynonyms({ word });
      setState({ data: result, message: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setState({ data: null, message: `An error occurred: ${errorMessage}` });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Synonym Finder / Thesaurus</CardTitle>
          <CardDescription>Find better word choices to improve your writing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="flex gap-2">
              <Input
                id="word"
                name="word"
                placeholder="Enter a word..."
                className="mt-1"
                required
              />
              <SubmitButton />
            </div>
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
            <CardTitle>Synonyms</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {state.data.synonyms.map((synonym) => (
              <Badge key={synonym} variant="secondary" className="text-base">
                {synonym}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
