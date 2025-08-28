
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function EncyclopediaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offline Encyclopedia / Wiki Extracts</CardTitle>
        <CardDescription>Get quick knowledge lookups without needing to browse the web.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                This feature would use an AI model to provide encyclopedia-style summaries of various topics. It is currently a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
