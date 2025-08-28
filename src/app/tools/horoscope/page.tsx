
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function HoroscopePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horoscope & Zodiac Info</CardTitle>
        <CardDescription>A quick daily fun tool.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                A horoscope tool would require an API to fetch daily zodiac information. As this is a placeholder, no such API is connected.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
