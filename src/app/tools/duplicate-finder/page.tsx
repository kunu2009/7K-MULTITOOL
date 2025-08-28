
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function DuplicateFinderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Duplicate File Finder</CardTitle>
        <CardDescription>Scan a folder to find duplicate files by name or content hash.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                For security reasons, web browsers cannot scan your local file system. This feature would require a native desktop application and is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
