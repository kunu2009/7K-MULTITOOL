
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function PdfToolsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Tools</CardTitle>
        <CardDescription>Merge, split, compress, or password-protect PDFs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Manipulating PDF files is a server-intensive task that requires specialized libraries. Implementing PDF tools robustly in a web client is complex and often requires a backend service. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
