
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FileArchive, FileWarning } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

export default function ZipExtractorPage() {
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileArchive/> ZIP/RAR Extractor & Creator</CardTitle>
            <CardDescription>An educational overview of how archive tools work.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
                <FileWarning className="h-4 w-4"/>
                <AlertTitle>This is an Educational Tool</AlertTitle>
                <AlertDescription>
                   Creating and extracting archive files like .zip or .rar is a complex process that is computationally intensive and requires specialized libraries. While it's possible to do this in the browser, it can be slow and unreliable for large files.
                   <br/><br/>
                   For handling archives, we recommend using a dedicated desktop application like 7-Zip (Windows) or The Unarchiver (macOS).
                   <br/><br/>
                   **How it works:** These tools use compression algorithms (like DEFLATE for ZIPs) to reduce file size by removing redundant data. When you extract an archive, the tool reads the compressed data and reconstructs the original files.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <LegalDisclaimer />
    </div>
  );
}
