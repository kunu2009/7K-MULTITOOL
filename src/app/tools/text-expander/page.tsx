
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function TextExpanderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Expander / Snippets</CardTitle>
        <CardDescription>Define shortcodes that expand into longer phrases or sentences.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                A text expander requires a UI for managing snippets and a background listener, which is complex for a simple web tool. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
