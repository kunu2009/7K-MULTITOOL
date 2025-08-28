
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function ScreenRulerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Screen Ruler & Color Sampler</CardTitle>
        <CardDescription>Measure pixels and sample colors from anywhere on your screen.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
               Due to browser security restrictions, web applications cannot interact with content outside of their own tab. A screen ruler or color sampler would require a dedicated browser extension or native application. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
