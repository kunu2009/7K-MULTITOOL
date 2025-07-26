'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { scanPortsAction, PortScannerState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, ScanLine, HelpCircle, CheckCircle, XCircle, ShieldQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const initialState: PortScannerState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
      {pending ? 'Simulating Scan...' : 'Scan Ports'}
    </Button>
  );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Open': return 'text-green-600';
        case 'Closed': return 'text-red-600';
        case 'Filtered': return 'text-yellow-600';
        default: return 'text-muted-foreground';
    }
}

const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
        case 'High': return 'bg-green-100 text-green-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-red-100 text-red-800';
        default: return 'bg-muted text-muted-foreground';
    }
}

export default function PortScannerPage() {
  const [state, formAction] = useActionState(scanPortsAction, initialState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ScanLine className="h-6 w-6" /> Educational Port Scanner</CardTitle>
          <CardDescription>Simulate a port scan on a target to learn which services might be running.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="target">Target</Label>
                    <Input id="target" name="target" placeholder="e.g., google.com or 8.8.8.8" className="mt-1" required />
                    {state.fieldErrors?.target && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.target.join(', ')}</p>}
                </div>
                 <div>
                    <Label htmlFor="ports">Ports</Label>
                    <Input id="ports" name="ports" placeholder="e.g., 80, 443, 20-22" className="mt-1" required defaultValue="21,22,25,80,110,143,443,3306,3389,5432,8080" />
                    {state.fieldErrors?.ports && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.ports.join(', ')}</p>}
                </div>
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
       <Alert>
          <ShieldQuestion className="h-4 w-4" />
          <AlertTitle>This is a Simulation</AlertTitle>
          <AlertDescription>
            This tool does not perform real network scans. It uses AI to predict the likely status of ports based on the type of target you enter. The results are for educational purposes to help you understand common server configurations.
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
            <CardTitle>Simulated Scan Results</CardTitle>
            <CardDescription>{state.data.summary}</CardDescription>
          </Header>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Port</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Confidence</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {state.data.results.map((result) => (
                        <TableRow key={result.port}>
                            <TableCell className="font-mono">{result.port}</TableCell>
                            <TableCell className={`font-semibold ${getStatusColor(result.status)}`}>{result.status}</TableCell>
                            <TableCell>{result.service || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant="outline" className={getConfidenceColor(result.confidence)}>{result.confidence}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About Port Scanning
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is a Port?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">In computer networking, a port is a communication endpoint. While an IP address identifies a specific machine, a port identifies a specific application or service running on that machine. There are 65,535 possible port numbers, with ports 0-1023 being "well-known" ports reserved for common services (e.g., Port 80 for web traffic).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="what-is-scanning">
              <AccordionTrigger>What is Port Scanning?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">Port scanning is the process of sending requests to a range of server ports on a host, with the goal of finding an active port. It's like checking the doors on a building to see which ones are unlocked. Network administrators use it to verify security policies, while attackers use it to identify running services to compromise.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="port-status">
              <AccordionTrigger>Understanding Port Statuses</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Open:</strong> An application is actively accepting connections on this port.</li>
                    <li><strong>Closed:</strong> The host received the request but there is no application listening on this port.</li>
                    <li><strong>Filtered:</strong> A firewall or other network device is blocking the port, so it's not possible to determine if it's open or closed. This is a common security practice.</li>
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
