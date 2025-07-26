'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { parseUserAgentAction, ParserState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, Fingerprint, HelpCircle, Bot, Smartphone, Monitor, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const initialState: ParserState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
      {pending ? 'Parsing...' : 'Parse User-Agent'}
    </Button>
  );
}

function ResultCard({ title, icon, data }: { title: string, icon: React.ReactNode, data: Record<string, string> }) {
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

export default function UserAgentParserPage() {
  const [state, formAction] = useFormState(parseUserAgentAction, initialState);
  const [userAgent, setUserAgent] = React.useState('');
  
  const handleDetect = () => {
    if (typeof window !== 'undefined') {
        setUserAgent(navigator.userAgent);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User-Agent Parser</CardTitle>
          <CardDescription>Analyze and decode User-Agent strings to reveal browser, OS, and device details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="userAgent">User-Agent String</Label>
              <Textarea
                id="userAgent"
                name="userAgent"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                placeholder="Paste a User-Agent string here..."
                className="mt-1 min-h-[150px] font-mono"
                required
              />
              {state.fieldErrors?.userAgent && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.userAgent.join(', ')}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
                <SubmitButton />
                <Button type="button" variant="outline" onClick={handleDetect}>Detect My User-Agent</Button>
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
            <CardTitle>Parsed Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <ResultCard title="Browser" icon={<Monitor className="h-6 w-6 text-primary" />} data={state.data.browser} />
             <ResultCard title="Operating System" icon={<Server className="h-6 w-6 text-primary" />} data={state.data.os} />
             <ResultCard title="Device" icon={<Smartphone className="h-6 w-6 text-primary" />} data={state.data.device} />
          </CardContent>
          {state.data.isBot && (
            <CardFooter>
                <Alert variant="default" className="w-full bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-500">
                    <Bot className="h-4 w-4" />
                    <AlertTitle>Bot Detected</AlertTitle>
                    <AlertDescription>This User-Agent appears to belong to a bot or web crawler.</AlertDescription>
                </Alert>
            </CardFooter>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            About User-Agent Strings
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="what-it-is">
            <AccordionItem value="what-it-is">
              <AccordionTrigger>What is a User-Agent?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">A User-Agent (UA) string is a line of text that a web browser or other client software sends to identify itself to a web server. It's like a digital name tag. Every time you visit a website, your browser sends this string along with the request for the webpage.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-it-works">
              <AccordionTrigger>What information does it contain?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground space-y-2">
                    A typical User-Agent string contains several pieces of information, often in a complex, hard-to-read format. Key details usually include:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Browser Name & Version:</strong> e.g., Chrome 108, Firefox 107.</li>
                        <li><strong>Operating System & Version:</strong> e.g., Windows 11, macOS 13.0.</li>
                        <li><strong>Rendering Engine:</strong> The software that draws the webpage content, like Gecko (for Firefox) or WebKit/Blink (for Chrome, Safari, Edge).</li>
                        <li><strong>Device Type:</strong> Whether it's a mobile phone, tablet, or desktop computer. Sometimes includes the model.</li>
                        <li><strong>Bot Identification:</strong> Search engine crawlers (like Googlebot) and other automated tools identify themselves as bots.</li>
                    </ul>
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-use-it">
              <AccordionTrigger>Why is it useful?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li><strong>Content Customization:</strong> Web servers can use the UA string to deliver content optimized for your device. For example, sending a mobile-friendly version of a site to a phone or a desktop version to a laptop.</li>
                    <li><strong>Analytics & Statistics:</strong> Website owners analyze UA strings to understand their audience, such as what percentage of users are on mobile vs. desktop, or which browsers are most popular. This data informs design and development decisions.</li>
                    <li><strong>Troubleshooting & Security:</strong> Developers use this information to debug browser-specific issues. Security systems might use it to identify outdated, vulnerable browsers or to block known malicious bots.</li>
                    <li><strong>Blocking/Allowing Bots:</strong> Websites can use the UA string to serve a simplified version of a page to search engine crawlers for better indexing, or to block undesirable bots from scraping content.</li>
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
