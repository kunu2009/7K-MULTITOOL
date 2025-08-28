
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function WifiTransferPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Transfer over Wi-Fi</CardTitle>
        <CardDescription>Transfer files between devices on the same local network.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Direct peer-to-peer file transfer over a local network requires complex networking capabilities (like WebRTC or a local server) that are beyond the scope of this simple application. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
