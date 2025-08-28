
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function OfflineFileSharePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offline File Share (QR-based)</CardTitle>
        <CardDescription>Send files between devices using QR codes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Sharing files via QR codes involves chunking the file data and encoding it into multiple QR codes, which is complex to manage and has severe file size limitations. This feature is currently a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
