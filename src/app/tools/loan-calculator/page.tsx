
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

function ResultDisplay({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center bg-secondary p-3 rounded-lg">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-mono text-xl font-semibold">${value}</p>
        </div>
    );
}

export default function LoanCalculatorPage() {
    const [amount, setAmount] = React.useState('10000');
    const [interest, setInterest] = React.useState([5]);
    const [years, setYears] = React.useState('5');

    const loanAmount = parseFloat(amount) || 0;
    const annualInterestRate = interest[0] / 100;
    const loanYears = parseInt(years) || 0;
    
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = loanYears * 12;
    
    let emi = '0.00';
    if (loanAmount > 0 && monthlyInterestRate > 0 && numberOfPayments > 0) {
        const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
        const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
        emi = (numerator / denominator).toFixed(2);
    }
    
    const totalPayment = (parseFloat(emi) * numberOfPayments).toFixed(2);
    const totalInterest = (parseFloat(totalPayment) - loanAmount).toFixed(2);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Loan / EMI Calculator</CardTitle>
                <CardDescription>Calculate your Equated Monthly Installment (EMI) for loans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Loan Amount ($)</Label>
                        <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="years">Loan Tenure (Years)</Label>
                        <Input id="years" type="number" value={years} onChange={e => setYears(e.target.value)} min="1" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Interest Rate: {interest[0]}%</Label>
                    <Slider value={interest} onValueChange={setInterest} max={20} step={0.1} />
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <ResultDisplay label="Monthly Payment (EMI)" value={emi} />
                    <ResultDisplay label="Total Interest Payable" value={totalInterest} />
                    <ResultDisplay label="Total Payment (Principal + Interest)" value={totalPayment} />
                </div>
            </CardContent>
        </Card>
    );
}
