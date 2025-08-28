
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function LoanCalculatorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan / EMI Calculator</CardTitle>
        <CardDescription>Calculate your Equated Monthly Installment (EMI) for loans.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                This feature requires a form to input loan amount, interest rate, and tenure to calculate the EMI. It is currently a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
