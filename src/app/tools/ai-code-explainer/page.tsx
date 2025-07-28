
'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { explainCode, ExplanationState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState: ExplanationState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Terminal className="mr-2 h-4 w-4" />}
      {pending ? 'Analyzing...' : 'Explain Code'}
    </Button>
  );
}

export default function AiCodeExplainerPage() {
  const [state, formAction] = useActionState(explainCode, initialState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Code Explainer</CardTitle>
          <CardDescription>Get a detailed explanation, security analysis, and suggestions for any code snippet.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="code">Code Snippet</Label>
              <Textarea
                id="code"
                name="code"
                placeholder="Paste your code here..."
                className="mt-1 min-h-[200px] font-mono"
                required
              />
              {state.fieldErrors?.code && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.code.join(', ')}</p>}
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
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Badge variant="secondary">Explanation</Badge></h3>
              <ScrollArea className="h-48 rounded-md border p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.data.explanation}</p>
              </ScrollArea>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Badge variant="destructive">Security Implications</Badge></h3>
              <ScrollArea className="h-48 rounded-md border p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.data.securityImplications}</p>
              </ScrollArea>
            </div>
            <div className="space-y-2">
                 <h3 className="font-semibold flex items-center gap-2"><Badge className="bg-accent text-accent-foreground hover:bg-accent/80">Suggestions</Badge></h3>
              <ScrollArea className="h-48 rounded-md border p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.data.suggestions}</p>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}

      <LegalDisclaimer />
    </div>
  );
}
