
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

export default function TipCalculatorPage() {
    const [bill, setBill] = React.useState('50');
    const [tipPercentage, setTipPercentage] = React.useState([15]);
    const [people, setPeople] = React.useState('1');

    const billAmount = parseFloat(bill) || 0;
    const numberOfPeople = parseInt(people) || 1;
    const tip = (billAmount * tipPercentage[0]) / 100;
    const total = billAmount + tip;
    const tipPerPerson = tip / numberOfPeople;
    const totalPerPerson = total / numberOfPeople;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tip & Split Bill Calculator</CardTitle>
                <CardDescription>Calculate the tip and split the bill between friends.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bill">Bill Amount ($)</Label>
                        <Input id="bill" type="number" value={bill} onChange={e => setBill(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="people">Number of People</Label>
                        <Input id="people" type="number" value={people} onChange={e => setPeople(e.target.value)} min="1" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Tip Percentage: {tipPercentage[0]}%</Label>
                    <Slider value={tipPercentage} onValueChange={setTipPercentage} max={50} step={1} />
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <ResultDisplay label="Tip Amount" value={tip.toFixed(2)} />
                    <ResultDisplay label="Total Bill" value={total.toFixed(2)} />
                    {numberOfPeople > 1 && (
                        <>
                           <ResultDisplay label="Tip Per Person" value={tipPerPerson.toFixed(2)} />
                           <ResultDisplay label="Total Per Person" value={totalPerPerson.toFixed(2)} />
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
