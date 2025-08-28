
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function GifMakerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GIF Maker</CardTitle>
        <CardDescription>Create animated GIFs from a series of images or a video clip.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
               Creating GIFs from video or images is a computationally intensive task that is best handled by a backend service. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
