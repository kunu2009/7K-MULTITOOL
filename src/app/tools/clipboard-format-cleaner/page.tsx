
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function ClipboardFormatCleanerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clipboard Format Cleaner</CardTitle>
        <CardDescription>Automatically strip styling from copied text and paste as plain text.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Intercepting and modifying the system clipboard is a complex operation with security implications that browsers restrict. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
