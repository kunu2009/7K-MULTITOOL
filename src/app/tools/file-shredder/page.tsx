
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function FileShredderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Shredder</CardTitle>
        <CardDescription>Securely delete sensitive files.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Securely deleting files (shredding) by overwriting their data on the hard drive is an OS-level task that a web browser cannot perform due to security sandboxing. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
