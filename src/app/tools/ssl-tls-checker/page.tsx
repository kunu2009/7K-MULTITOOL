'use client';

import * as React from 'react';
import { useActionState, useFormStatus } from 'react-dom';
import { checkSslAction, SslCheckState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, ShieldCheck, ShieldQuestion, Calendar, Fingerprint, ListTree, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const initialState: SslCheckState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
      {pending ? 'Checking...' : 'Check Domain'}
    </Button>
  );
}

const getStatusBadge = (status: 'Valid' | 'Expired' | 'Warning' | 'Error' | undefined) => {
    switch(status) {
        case 'Valid': return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="mr-2 h-4 w-4" />Valid</Badge>
        case 'Expired': return <Badge variant="destructive"><Clock className="mr-2 h-4 w-4" />Expired</Badge>
        case 'Warning': return <Badge variant="secondary" className="bg-yellow-500 text-black hover:bg-yellow-600"><AlertCircle className="mr-2 h-4 w-4" />Warning</Badge>
        case 'Error': return <Badge variant="destructive"><AlertCircle className="mr-2 h-4 w-4" />Error</Badge>
        default: return null;
    }
}

function InfoCard({ title, icon, data }: { title: string; icon: React.ReactNode; data: Record<string, string | number>}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {icon}
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                        <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-mono text-right">{value}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function SslTlsCheckerPage() {
  const [state, formAction] = useActionState(checkSslAction, initialState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-6 w-6" /> Educational SSL/TLS Checker</CardTitle>
          <CardDescription>Simulate a check of a domain's SSL/TLS certificate to learn about its properties.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                name="domain"
                placeholder="e.g., google.com"
                className="mt-1"
                required
              />
              {state.fieldErrors?.domain && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.domain.join(', ')}</p>}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <Alert>
          <ShieldQuestion className="h-4 w-4" />
          <AlertTitle>This is a Simulation</AlertTitle>
          <AlertDescription>
            This tool does not perform a real network request. It uses AI to predict the likely certificate details for a given domain for educational purposes.
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
            <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>Certificate Details</CardTitle>
                <div className="flex items-center gap-2">
                    {getStatusBadge(state.data.overallResult.status)}
                </div>
            </div>
            <CardDescription>{state.data.overallResult.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard title="Subject" icon={<Fingerprint className="h-5 w-5 text-primary" />} data={state.data.certificate.subject} />
                <InfoCard title="Issuer" icon={<ListTree className="h-5 w-5 text-primary" />} data={state.data.certificate.issuer} />
                <InfoCard title="Validity" icon={<Calendar className="h-5 w-5 text-primary" />} data={state.data.certificate.validity} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Subject Alternative Names (SANs)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {state.data.certificate.subjectAltNames.map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Signature Algorithm</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="font-mono text-sm">{state.data.certificate.signatureAlgorithm}</p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      <LegalDisclaimer />
    </div>
  );
}
