
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function BillSplitHistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill Split with History</CardTitle>
        <CardDescription>Remember who owes what from past events.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                A bill splitting tool with history requires persistent data storage, user accounts, and a more complex UI for managing groups and debts. This feature is currently a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
