
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function CronBuilderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cron Expression Builder</CardTitle>
        <CardDescription>Build & test cron jobs visually.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                This feature requires a user interface for selecting time units (minute, hour, day, etc.) and translating them into a valid cron string. It is currently a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
