
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function FileSplitterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Splitter & Joiner</CardTitle>
        <CardDescription>Split large files into smaller parts and merge them back together.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Reading and writing large file chunks is a file-system-intensive operation that is not suitable for a standard web browser environment due to security and performance limitations. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
