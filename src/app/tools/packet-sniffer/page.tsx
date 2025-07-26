'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { simulateCaptureAction, PacketSnifferState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, ShieldQuestion, FileWarning, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const initialState: PacketSnifferState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldQuestion className="mr-2 h-4 w-4" />}
      {pending ? 'Simulating...' : 'Simulate Capture'}
    </Button>
  );
}

const getProtocolBadge = (protocol: string) => {
    let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    if (protocol.includes('TCP') || protocol.includes('HTTP')) colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    if (protocol.includes('UDP') || protocol.includes('DNS')) colorClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    if (protocol.includes('TLS') || protocol.includes('HTTPS')) colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    if (protocol.includes('ICMP')) colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    return <Badge variant="outline" className={`border-0 ${colorClass}`}>{protocol}</Badge>;
}

export default function PacketSnifferPage() {
  const [state, formAction] = useActionState(simulateCaptureAction, initialState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldQuestion className="h-6 w-6" /> Educational Packet Sniffer</CardTitle>
          <CardDescription>Simulate a network packet capture by describing a scenario.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="scenario">Network Scenario</Label>
              <Textarea
                id="scenario"
                name="scenario"
                placeholder="e.g., A user securely logs into a website."
                className="mt-1 min-h-[100px]"
                required
              />
              {state.fieldErrors?.scenario && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.scenario.join(', ')}</p>}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>This is a Simulation</AlertTitle>
          <AlertDescription>
            This tool does not capture real network traffic. It uses AI to generate a plausible sequence of packets for a given scenario to help you learn about network interactions.
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
            <CardTitle>Simulated Packet Capture</CardTitle>
            <CardDescription>{state.data.summary}</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-24">Timestamp</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Protocol</TableHead>
                        <TableHead>Summary</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {state.data.packets.map((packet, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-mono text-xs">{packet.timestamp}</TableCell>
                            <TableCell className="font-mono text-xs">{packet.sourceIp}:{packet.sourcePort}</TableCell>
                            <TableCell className="font-mono text-xs">{packet.destinationIp}:{packet.destinationPort}</TableCell>
                            <TableCell>{getProtocolBadge(packet.protocol)}</TableCell>
                            <TableCell className="text-sm">{packet.summary}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <LegalDisclaimer />
    </div>
  );
}
