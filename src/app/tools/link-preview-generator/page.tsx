
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function LinkPreviewGeneratorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Preview Generator</CardTitle>
        <CardDescription>Paste a link to preview metadata and thumbnail.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Fetching metadata from arbitrary URLs from the client-side is often blocked by CORS (Cross-Origin Resource Sharing) policies. A reliable implementation requires a backend proxy service to fetch the data. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
