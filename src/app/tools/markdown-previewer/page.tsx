
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function MarkdownPreviewerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Markdown Previewer</CardTitle>
        <CardDescription>Live render Markdown and convert to HTML/PDF.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                This feature requires a Markdown parsing library and a side-by-side view to render the output in real-time. It is currently a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
