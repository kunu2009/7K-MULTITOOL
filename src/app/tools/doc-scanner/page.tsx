
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function DocScannerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Scanner (OCR)</CardTitle>
        <CardDescription>Extract text from images/screenshots.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Optical Character Recognition (OCR) is a complex process that typically requires a dedicated backend service for accurate text extraction. Implementing this robustly is beyond the scope of this simple tool. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
