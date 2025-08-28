
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function ImageFormatConverterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Format Converter</CardTitle>
        <CardDescription>Convert images between PNG, JPG, WebP, and other formats.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
               Client-side image format conversion can be complex. This tool is a placeholder for a more robust implementation.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
