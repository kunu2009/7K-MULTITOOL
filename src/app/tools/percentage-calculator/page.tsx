
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function ResultDisplay({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center bg-secondary p-3 rounded-lg">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-mono text-xl font-semibold">{value}</p>
        </div>
    );
}

export default function PercentageCalculatorPage() {
    const [val1, setVal1] = React.useState('10');
    const [val2, setVal2] = React.useState('50');

    const num1 = parseFloat(val1) || 0;
    const num2 = parseFloat(val2) || 0;
    
    const percentageOf = num2 !== 0 ? ((num1 / num2) * 100).toFixed(2) + '%' : 'N/A';
    const isWhatPercent = num1 !== 0 ? ((num2 / num1) * 100).toFixed(2) + '%' : 'N/A';
    const percentIncrease = num1 !== 0 ? (((num2 - num1) / num1) * 100).toFixed(2) + '%' : 'N/A';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Percentage Calculator</CardTitle>
                <CardDescription>Quickly perform various percentage calculations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="val1">Value 1</Label>
                        <Input id="val1" type="number" value={val1} onChange={e => setVal1(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="val2">Value 2</Label>
                        <Input id="val2" type="number" value={val2} onChange={e => setVal2(e.target.value)} />
                    </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                    <ResultDisplay label={`${val1} is what percent of ${val2}?`} value={percentageOf} />
                    <ResultDisplay label={`What is ${val1}% of ${val2}?`} value={((num1 / 100) * num2).toFixed(2)} />
                    <ResultDisplay label={`Percentage increase from ${val1} to ${val2}`} value={percentIncrease} />
                </div>
            </CardContent>
        </Card>
    );
}
