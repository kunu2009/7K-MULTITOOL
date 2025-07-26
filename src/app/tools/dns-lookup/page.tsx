'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getDnsRecordsAction, DnsState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, Search, HelpCircle, Dna } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const initialState: DnsState = {
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

type Record = {
    type: string;
    value: string;
    ttl?: string;
}

function ResultTable({ title, records }: { title: string, records: Record[] | undefined }) {
    if (!records || records.length === 0) return null;
    
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title} Records</h3>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="text-right">TTL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.map((record, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-mono text-xs"><div className="bg-muted text-muted-foreground rounded-md px-2 py-1 inline-block">{record.type}</div></TableCell>
                                <TableCell className="font-mono text-sm break-all">{record.value}</TableCell>
                                <TableCell className="font-mono text-sm text-right">{record.ttl || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default function DnsLookupPage() {
  const [state, formAction] = useFormState(getDnsRecordsAction, initialState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Dna className="h-6 w-6" /> DNS Lookup</CardTitle>
          <CardDescription>Find DNS records for a specific domain name.</CardDescription>
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
            <CardTitle>DNS Records</CardTitle>
            <CardDescription>Displaying DNS records for the requested domain.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResultTable title="A" records={state.data.a} />
            <ResultTable title="AAAA" records={state.data.aaaa} />
            <ResultTable title="CNAME" records={state.data.cname} />
            <ResultTable title="MX" records={state.data.mx} />
            <ResultTable title="NS" records={state.data.ns} />
            <ResultTable title="TXT" records={state.data.txt} />
            <ResultTable title="SOA" records={state.data.soa} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About DNS
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is DNS?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">The Domain Name System (DNS) is the phonebook of the Internet. Humans access information online through domain names, like google.com or amazon.com. Web browsers interact through Internet Protocol (IP) addresses. DNS translates domain names to IP addresses so browsers can load Internet resources.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="records">
              <AccordionTrigger>Common Record Types</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>A Record:</strong> Points a domain to an IPv4 address (e.g., 172.217.6.78).</li>
                    <li><strong>AAAA Record:</strong> Points a domain to an IPv6 address.</li>
                    <li><strong>CNAME Record:</strong> Forwards one domain or subdomain to another domain, does NOT provide an IP address.</li>
                    <li><strong>MX Record:</strong> Directs mail to an email server.</li>
                    <li><strong>NS Record:</strong> Indicates which Name Servers are authoritative for the domain.</li>
                    <li><strong>TXT Record:</strong> Lets an admin store text notes. Often used for email security (SPF, DKIM).</li>
                    <li><strong>SOA Record:</strong> Start of Authority. Contains important info about the domain, like the primary name server and administrator's email.</li>
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
