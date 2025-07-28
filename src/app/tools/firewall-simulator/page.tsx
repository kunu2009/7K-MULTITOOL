
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { simulateFirewallAction, FirewallSimulatorState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, ShieldQuestion, ServerCog, ShieldCheck, ShieldClose, HelpingHand, FileWarning, BadgeInfo } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const initialState: FirewallSimulatorState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldQuestion className="mr-2 h-4 w-4" />}
      {pending ? 'Simulating...' : 'Test Scenario'}
    </Button>
  );
}

export default function FirewallSimulatorPage() {
  const [state, setState] = React.useState<FirewallSimulatorState>(initialState);

  const formAction = async (formData: FormData) => {
    const result = await simulateFirewallAction(initialState, formData);
    setState(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ServerCog className="h-6 w-6" /> Educational Firewall Simulator</CardTitle>
          <CardDescription>Define firewall rules and test how they handle different network traffic scenarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="rules">Firewall Rules (one per line, e.g., "ALLOW TCP from any to 192.168.1.1 on port 443")</Label>
              <Textarea
                id="rules"
                name="rules"
                placeholder="DENY UDP from any to any on port 53&#10;ALLOW TCP from 10.0.0.0/8 to any on port 80"
                className="mt-1 min-h-[150px] font-mono"
                required
                defaultValue="ALLOW TCP from any to 192.168.1.100 on port 443
DENY TCP from any to any"
              />
              {state.fieldErrors?.rules && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.rules.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="trafficScenario">Traffic Scenario (describe a connection attempt)</Label>
              <Textarea
                id="trafficScenario"
                name="trafficScenario"
                placeholder="e.g., An incoming request from a corporate laptop (10.1.2.3) to the web server (192.168.1.100) on the HTTPS port."
                className="mt-1 min-h-[100px]"
                required
                defaultValue="An incoming connection from public IP 203.0.113.88 to server 192.168.1.100 on port 443."
              />
              {state.fieldErrors?.trafficScenario && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.trafficScenario.join(', ')}</p>}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
       <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>This is a Simulation</AlertTitle>
          <AlertDescription>
            This tool does not configure a real firewall. It uses AI to interpret your rules and predict the outcome for a given scenario. It's for learning purposes only.
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
            <CardTitle>Simulation Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border p-4">
              {state.data.decision === 'Allowed' ? (
                <ShieldCheck className="h-12 w-12 text-green-500 shrink-0" />
              ) : (
                <ShieldClose className="h-12 w-12 text-destructive shrink-0" />
              )}
              <div className="flex-1">
                <Badge variant={state.data.decision === 'Allowed' ? 'default' : 'destructive'} className={state.data.decision === 'Allowed' ? 'bg-green-600' : ''}>
                  {state.data.decision}
                </Badge>
                <p className="text-muted-foreground mt-2">{state.data.reason}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><BadgeInfo className="h-5 w-5" /> Rules Explanation</h3>
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md">{state.data.rulesExplanation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <LegalDisclaimer />
    </div>
  );
}
