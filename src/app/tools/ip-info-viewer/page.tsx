'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getIpInfoAction, IpInfoState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, Search, HelpCircle, MapPin, Building, Wifi, ShieldAlert, LocateFixed } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const initialState: IpInfoState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'Searching...' : 'Lookup IP'}
    </Button>
  );
}

function ResultCard({ title, icon, data }: { title: string, icon: React.ReactNode, data: Record<string, string | number> }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {icon}
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 text-sm">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                            <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-mono text-right">{value || 'N/A'}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function IpInfoViewerPage() {
  const [state, formAction] = useFormState(getIpInfoAction, initialState);
  const [ipAddress, setIpAddress] = React.useState('');

  const myIpFormRef = React.useRef<HTMLFormElement>(null);

  const handleDetectMyIp = () => {
    setIpAddress('');
    // Use a timeout to ensure the state updates before submitting
    setTimeout(() => {
        myIpFormRef.current?.requestSubmit();
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IP Address Information Viewer</CardTitle>
          <CardDescription>Get location and network details for any IP address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} ref={myIpFormRef} className="space-y-4">
            <div>
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                name="ipAddress"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="e.g., 8.8.8.8"
                className="mt-1 font-mono"
              />
              {state.fieldErrors?.ipAddress && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.ipAddress.join(', ')}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
                <SubmitButton />
                <Button type="button" variant="outline" onClick={handleDetectMyIp}>
                    <LocateFixed className="mr-2 h-4 w-4" />
                    Detect My IP
                </Button>
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
            <CardTitle>Lookup Results for <span className="font-mono text-primary">{state.data.ipAddress}</span></CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
             <ResultCard title="Location" icon={<MapPin className="h-6 w-6 text-primary" />} data={state.data.location} />
             <div className="space-y-4">
                <ResultCard title="Network" icon={<Wifi className="h-6 w-6 text-primary" />} data={{ isp: state.data.isp, organization: state.data.organization }} />
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                        <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Proxy or VPN:</span>
                                <span className={`font-semibold ${state.data.isProxyOrVpn ? 'text-destructive' : 'text-green-600'}`}>{state.data.isProxyOrVpn ? 'Yes' : 'No'}</span>
                            </div>
                             <div className="space-y-1">
                                <span className="text-muted-foreground">Assessment:</span>
                                <p className="font-mono">{state.data.threatAssessment}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
             </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About IP Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is an IP Address?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">An Internet Protocol (IP) address is a unique numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication. It serves two main functions: identifying the host or network interface and providing the location of the host in the network.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ipv4-vs-ipv6">
              <AccordionTrigger>IPv4 vs. IPv6</AccordionTrigger>
              <AccordionContent>
                 <p className="text-muted-foreground">You'll encounter two versions of IP addresses. <strong>IPv4</strong> is the most common (e.g., `192.168.1.1`), but the available addresses have nearly run out. <strong>IPv6</strong> was created to solve this, offering a vastly larger address space (e.g., `2001:0db8:85a3:0000:0000:8a2e:0370:7334`).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-use-it">
              <AccordionTrigger>Why is looking up IP info useful?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Geolocation:</strong> To identify the approximate geographical location of a user or server, which can be used for content customization or fraud detection.</li>
                    <li><strong>Cybersecurity:</strong> Security professionals analyze IP addresses to track the origin of cyberattacks, identify malicious bots, and block traffic from suspicious sources.</li>
                    <li><strong>Network Troubleshooting:</strong> To diagnose network problems by verifying that devices are correctly configured and can communicate with each other.</li>
                    <li><strong>Content Delivery:</strong> Content Delivery Networks (CDNs) use IP location to serve content from the nearest server, reducing latency and improving speed.</li>
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
