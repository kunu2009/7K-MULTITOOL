
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with a real API key from a currency API like exchangerate-api.com
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

export default function CurrencyConverterPage() {
  const [rates, setRates] = React.useState<Record<string, number>>({});
  const [fromCurrency, setFromCurrency] = React.useState('USD');
  const [toCurrency, setToCurrency] = React.useState('EUR');
  const [amount, setAmount] = React.useState(1);
  const [result, setResult] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        toast({ title: 'API Key Needed', description: 'Please add a valid ExchangeRate-API key.', variant: 'destructive'});
        return;
    }
    const fetchRates = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if(data.result === "success") {
            setRates(data.conversion_rates);
        } else {
            toast({ title: 'API Error', description: 'Could not fetch exchange rates.', variant: 'destructive'});
        }
      } catch (error) {
        toast({ title: 'Network Error', description: 'Could not connect to the API.', variant: 'destructive'});
      }
    };
    fetchRates();
  }, []);

  const handleConvert = () => {
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      toast({ title: 'Error', description: 'Could not find rates for selected currencies.', variant: 'destructive' });
      return;
    }
    const rate = rates[toCurrency] / rates[fromCurrency];
    setResult(amount * rate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between different currencies. (API Key required)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Amount</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <div>
            <Label>From</Label>
            {/* In a real app, this would be a <Select> component */}
            <Input value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value.toUpperCase())} placeholder="e.g. USD" />
          </div>
          <div>
            <Label>To</Label>
            <Input value={toCurrency} onChange={(e) => setToCurrency(e.target.value.toUpperCase())} placeholder="e.g. EUR"/>
          </div>
        </div>
        <Button onClick={handleConvert}>Convert</Button>
        {result !== null && (
            <div className="pt-4">
                <p className="text-lg font-semibold">{amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
