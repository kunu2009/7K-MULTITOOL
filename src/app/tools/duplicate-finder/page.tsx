
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase, FileWarning } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

export default function DuplicateFinderPage() {
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Duplicate File Finder (Simulation)</CardTitle>
            <CardDescription>An educational look at how duplicate file finders work.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
                <FileWarning className="h-4 w-4"/>
                <AlertTitle>This is a Simulation</AlertTitle>
                <AlertDescription>
                   For security reasons, web browsers cannot scan your local file system to find duplicate files. This kind of tool requires a native desktop application with permission to read your files.
                   <br/><br/>
                   A real duplicate file finder would work by:
                   <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Scanning all files in a selected folder.</li>
                        <li>Grouping files by the exact same size, as files with different sizes cannot be duplicates.</li>
                        <li>For each group of same-sized files, it calculates a unique hash (like SHA-256) for each file's content.</li>
                        <li>Files with the same hash are confirmed duplicates, and the tool presents them to you for review and deletion.</li>
                   </ol>
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <LegalDisclaimer />
    </div>
  );
}
