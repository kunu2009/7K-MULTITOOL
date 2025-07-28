
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { getWhoisRecordsAction, WhoisState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, Search, HelpCircle, BookUser } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState: WhoisState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Searching...' : 'Lookup Domain'}
    </Button>
  );
}

export default function WhoisLookupPage() {
  const [state, setState] = React.useState<WhoisState>(initialState);

  const formAction = async (formData: FormData) => {
    const result = await getWhoisRecordsAction(initialState, formData);
    setState(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookUser className="h-6 w-6" /> WHOIS Lookup</CardTitle>
          <CardDescription>Find registration information for a specific domain name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                name="domain"
                placeholder="e.g., google.com"
                className="mt-1 font-mono"
                required
              />
              {state.fieldErrors?.domain && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.domain.join(', ')}</p>}
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
            <CardTitle>WHOIS Record for <span className="text-primary font-mono">{state.data.domainName}</span></CardTitle>
            <CardDescription>Displaying public registration data for the requested domain.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Key Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Registrar:</span>
                                <span className="font-mono">{state.data.registrar}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Registration Date:</span>
                                <span className="font-mono">{state.data.registrationDate}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Expiration Date:</span>
                                <span className="font-mono">{state.data.expirationDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Updated Date:</span>
                                <span className="font-mono">{state.data.updatedDate}</span>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Domain Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {state.data.status.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Name Servers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           {state.data.nameServers.map(ns => <div key={ns} className="font-mono text-sm">{ns}</div>)}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Raw WHOIS Data</h3>
                    <ScrollArea className="h-96 rounded-md border p-4 font-mono text-xs">
                       <pre>{state.data.rawText}</pre>
                    </ScrollArea>
                </div>
             </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About WHOIS
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is WHOIS?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">WHOIS is a query and response protocol that is widely used for querying databases that store the registered users or assignees of an Internet resource, such as a domain name, an IP address block, or an autonomous system. It provides public access to information about domain name registrations.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="records">
              <AccordionTrigger>What information is in a WHOIS record?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">A WHOIS record contains details about a domain name, including who owns it, when it was registered, when it expires, and which name servers it uses. However, due to privacy regulations like GDPR, much of the personal contact information (registrant name, address, email) is often redacted or hidden behind a privacy service.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-use-it">
              <AccordionTrigger>Why is it useful?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Domain Ownership:</strong> To check the availability of a domain name or to find out who owns a particular domain.</li>
                    <li><strong>Cybersecurity:</strong> Security researchers and law enforcement use WHOIS data to track down the source of spam, fraud, and cyberattacks.</li>
                    <li><strong>Network Administration:</strong> Network administrators use it to identify and fix network problems.</li>
                    <li><strong>Brand Protection:</strong> Companies use it to monitor for trademark infringement and cybersquatting.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <LegalDisclaimer />
    </div>
  );
}
