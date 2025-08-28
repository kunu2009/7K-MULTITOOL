
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Gauge, Loader2 } from 'lucide-react';

export default function PingTesterPage() {
  const [url, setUrl] = React.useState('https://google.com');
  const [latency, setLatency] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState<'success' | 'error' | 'idle'>('idle');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handlePing = async () => {
    if (!url) {
        toast({ title: 'URL is required', variant: 'destructive'});
        return;
    }
    setLoading(true);
    setLatency(null);
    setStatus('idle');
    const startTime = Date.now();

    try {
      // We use 'no-cors' mode because we only care about the timing, not the response body.
      // This avoids CORS issues with most servers.
      await fetch(url, { mode: 'no-cors', cache: 'no-store' });
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setStatus('success');
    } catch (e) {
      setStatus('error');
      toast({ title: 'Ping Failed', description: 'Could not reach the host. It may be down or blocking requests.', variant: 'destructive'});
    } finally {
        setLoading(false);
    }
  }

  const getLatencyColor = () => {
    if (!latency) return 'text-muted-foreground';
    if (latency < 100) return 'text-green-500';
    if (latency < 300) return 'text-yellow-500';
    return 'text-red-500';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ping & Latency Tester</CardTitle>
        <CardDescription>Measure the network latency to a web server from your browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
                <Label htmlFor="url-input">URL</Label>
                <Input id="url-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com"/>
            </div>
            <div className="self-end">
                <Button onClick={handlePing} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 animate-spin"/> : <Gauge className="mr-2"/>}
                    Ping
                </Button>
            </div>
        </div>
        {status !== 'idle' && (
            <Card className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">Latency</p>
                 {loading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-primary my-2" />
                 ) : (
                    <p className={`text-6xl font-bold ${getLatencyColor()}`}>
                        {latency !== null ? `${latency}` : '--'}
                        <span className="text-xl ml-2">ms</span>
                    </p>
                 )}
                
                {status === 'success' && <p className="text-green-600 font-semibold">Successfully connected to host.</p>}
                {status === 'error' && <p className="text-destructive font-semibold">Failed to connect to host.</p>}
            </Card>
        )}
      </CardContent>
    </Card>
  )
}
