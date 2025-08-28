
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { checkPasswordBreachAction, BreachState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, ShieldQuestion, ShieldCheck, ShieldClose, FileWarning } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: BreachState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldQuestion className="mr-2 h-4 w-4" />}
      {pending ? 'Checking...' : 'Check Password'}
    </Button>
  );
}

export default function PasswordBreachCheckerPage() {
  const [state, setState] = React.useState<BreachState>(initialState);

  const formAction = async (formData: FormData) => {
    const result = await checkPasswordBreachAction(initialState, formData);
    setState(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldQuestion className="h-6 w-6" /> Password Breach Checker</CardTitle>
          <CardDescription>Check if a password has appeared in a data breach (simulated check).</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a password to check"
                className="mt-1"
                required
              />
              {state.fieldErrors?.password && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.password.join(', ')}</p>}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>This is a Simulation</AlertTitle>
          <AlertDescription>
            This tool does not use a real password breach database. It uses AI to provide a simulated response for educational purposes. Your password is not sent to any third-party service.
          </AlertDescription>
      </Alert>

      {state.message && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.data && (
        <Card>
          <CardHeader>
            <CardTitle>Check Result</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border p-4">
              {state.data.isPwned ? (
                <ShieldClose className="h-12 w-12 text-destructive shrink-0" />
              ) : (
                <ShieldCheck className="h-12 w-12 text-green-500 shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-lg font-semibold">{state.data.isPwned ? 'Oh no — pwned!' : 'Good news — no pwnage found!'}</p>
                <p className="text-muted-foreground mt-2">{state.data.message}</p>
              </div>
            </CardContent>
        </Card>
      )}

      <LegalDisclaimer />
    </div>
  );
}
