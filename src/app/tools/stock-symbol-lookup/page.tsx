
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function StockSymbolLookupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Symbol Lookup</CardTitle>
        <CardDescription>Get quick info on stock symbols from financial APIs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                This feature requires an API key from a financial data provider like AlphaVantage or Yahoo Finance. It is currently a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
