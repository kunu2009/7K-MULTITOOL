
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function FakeEmailGeneratorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fake Email Generator</CardTitle>
        <CardDescription>Create a temporary inbox for sign-ups without using your real email.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                A temporary email service requires a dedicated backend to receive and display emails. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
