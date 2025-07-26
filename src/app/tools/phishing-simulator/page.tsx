'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { generateEmailAction, PhishingSimulatorState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, AlertTriangle, Fish, Lightbulb, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const initialState: PhishingSimulatorState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fish className="mr-2 h-4 w-4" />}
      {pending ? 'Generating...' : 'Generate Phishing Email'}
    </Button>
  );
}

export default function PhishingSimulatorPage() {
  const [state, formAction] = React.useActionState(generateEmailAction, initialState);
  const [scenario, setScenario] = React.useState('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Phishing Simulator</CardTitle>
          <CardDescription>Learn to spot phishing attacks by generating simulated phishing emails for educational purposes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="targetName">Target's Name</Label>
                    <Input id="targetName" name="targetName" placeholder="e.g., Alex Doe" required />
                    {state.fieldErrors?.targetName && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.targetName.join(', ')}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="companyName">Impersonated Company</Label>
                    <Input id="companyName" name="companyName" placeholder="e.g., Global Bank Corp" required />
                    {state.fieldErrors?.companyName && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.companyName.join(', ')}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="scenario">Scenario</Label>
                <Select name="scenario" onValueChange={setScenario} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a phishing scenario" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Unusual Login Activity">Unusual Login Activity</SelectItem>
                        <SelectItem value="Password Reset Request">Password Reset Request</SelectItem>
                        <SelectItem value="Invoice Overdue">Invoice Overdue</SelectItem>
                        <SelectItem value="You've won a prize!">You've won a prize!</SelectItem>
                        <SelectItem value="Verify Your Account">Verify Your Account</SelectItem>
                    </SelectContent>
                </Select>
                 {state.fieldErrors?.scenario && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.scenario.join(', ')}</p>}
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
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Simulated Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-4 space-y-4 bg-background">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{state.data.emailSubject}</p>
                            <p className="text-xs text-muted-foreground">From: noreply@{state.fieldErrors?.companyName?.[0].toLowerCase().replace(/ /g, '')}.com</p>
                        </div>
                        <Separator />
                        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: state.data.emailBody }} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500" /> Red Flags</CardTitle>
                    <CardDescription>Here's what gives this email away as a phishing attempt.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {state.data.redFlags.map((flag, index) => (
                           <li key={index} className="flex items-start gap-3">
                                <AlertTriangle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                                <span className="text-sm text-muted-foreground">{flag}</span>
                           </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}

      <LegalDisclaimer />
    </div>
  );
}
