
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RestApiTesterPage() {
  const [method, setMethod] = React.useState('GET');
  const [url, setUrl] = React.useState('');
  const [headers, setHeaders] = React.useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [responseStatus, setResponseStatus] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    setLoading(true);
    setResponse('');
    setResponseStatus(null);
    try {
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: ['GET', 'HEAD'].includes(method) ? undefined : body,
      });

      const responseText = await res.text();
      setResponseStatus(res.status);
      try {
        setResponse(JSON.stringify(JSON.parse(responseText), null, 2));
      } catch {
        setResponse(responseText);
      }
    } catch (error: any) {
      toast({ title: 'Request Failed', description: error.message, variant: 'destructive' });
      setResponse(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = () => {
    if (!responseStatus) return '';
    if (responseStatus >= 200 && responseStatus < 300) return 'bg-green-500';
    if (responseStatus >= 400 && responseStatus < 500) return 'bg-yellow-500';
    if (responseStatus >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>REST API Tester</CardTitle>
          <CardDescription>Send HTTP requests to any URL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/data" />
            <Button onClick={handleSend} disabled={loading || !url}>
              {loading ? <Loader2 className="mr-2 animate-spin" /> : <Send />}
              Send
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headers">Headers</Label>
              <Textarea id="headers" value={headers} onChange={(e) => setHeaders(e.target.value)} className="min-h-[150px] font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[150px] font-mono" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <CardTitle>Response</CardTitle>
                {responseStatus && (
                    <Badge className={getStatusColor()}>{responseStatus}</Badge>
                )}
            </div>
        </CardHeader>
        <CardContent>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">{loading ? 'Loading...' : response || 'Response will appear here.'}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
