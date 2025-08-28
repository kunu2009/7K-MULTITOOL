
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function ClipboardSyncPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clipboard Sync (LAN)</CardTitle>
        <CardDescription>Sync your clipboard between your phone and laptop on the same network.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                A local clipboard sync tool requires complex networking (like WebRTC) or a local server component to function. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
