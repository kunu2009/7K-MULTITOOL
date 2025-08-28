
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function PdfSpeechReaderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF → Speech Reader</CardTitle>
        <CardDescription>Upload a PDF file and have its text content read aloud to you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                This feature requires a client-side library to parse PDF files and extract text, which would then be sent to a Text-to-Speech engine. This is a placeholder for that complex functionality.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
