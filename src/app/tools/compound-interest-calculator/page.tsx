
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Landmark } from 'lucide-react';

function ResultDisplay({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center bg-secondary p-3 rounded-lg">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-mono text-xl font-semibold">${value}</p>
        </div>
    );
}

export default function CompoundInterestCalculatorPage() {
    const [principal, setPrincipal] = React.useState('1000');
    const [rate, setRate] = React.useState([5]);
    const [years, setYears] = React.useState('10');
    const [monthlyContribution, setMonthlyContribution] = React.useState('100');

    const p = parseFloat(principal) || 0;
    const r = (rate[0] / 100);
    const t = parseInt(years) || 0;
    const m = parseFloat(monthlyContribution) || 0;
    
    let futureValue = p * Math.pow((1 + r/12), 12*t);
    if (m > 0) {
        futureValue += m * ((Math.pow(1 + r/12, 12*t) - 1) / (r/12));
    }
    
    const totalInvested = p + (m * 12 * t);
    const totalInterest = futureValue - totalInvested;
    

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Landmark/> Compound Interest Calculator</CardTitle>
                <CardDescription>Calculate the future value of your investments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="principal">Initial Principal ($)</Label>
                        <Input id="principal" type="number" value={principal} onChange={e => setPrincipal(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="monthly">Monthly Contribution ($)</Label>
                        <Input id="monthly" type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="years">Years to Grow</Label>
                        <Input id="years" type="number" value={years} onChange={e => setYears(e.target.value)} min="1" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Estimated Annual Interest Rate: {rate[0]}%</Label>
                    <Slider value={rate} onValueChange={setRate} max={20} step={0.1} />
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <ResultDisplay label="Total Invested" value={totalInvested.toFixed(2)} />
                    <ResultDisplay label="Total Interest Earned" value={totalInterest.toFixed(2)} />
                    <ResultDisplay label="Future Value" value={futureValue.toFixed(2)} />
                </div>
            </CardContent>
        </Card>
    );
}
