
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function RemindersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Birthday & Reminder Tool</CardTitle>
        <CardDescription>Store important dates and get notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
               A reminder tool with notifications requires a backend service and push notification capabilities to function reliably when the app is not open. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
