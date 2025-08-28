
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function StatCard({ label, value, unit, color }: { label: string; value: string; unit: string; color?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
            <p className={`text-3xl font-bold ${color}`}>
                {value}
                <span className="text-lg font-normal text-muted-foreground ml-1">{unit}</span>
            </p>
            <p className="text-sm font-medium text-muted-foreground mt-1">{label}</p>
        </div>
    );
}

export default function BmiCalculatorPage() {
    const [unitSystem, setUnitSystem] = React.useState('metric');
    const [height, setHeight] = React.useState('180'); // cm or inches
    const [weight, setWeight] = React.useState('75');  // kg or lbs
    
    const isMetric = unitSystem === 'metric';

    const { bmi, category, color } = React.useMemo(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
            return { bmi: 0, category: 'N/A', color: 'text-muted-foreground' };
        }

        let bmiValue;
        if (isMetric) { // height in cm, weight in kg
            bmiValue = w / ((h / 100) * (h / 100));
        } else { // height in inches, weight in lbs
            bmiValue = (w / (h * h)) * 703;
        }

        let cat, col;
        if (bmiValue < 18.5) {
            cat = 'Underweight';
            col = 'text-blue-500';
        } else if (bmiValue < 24.9) {
            cat = 'Normal weight';
            col = 'text-green-500';
        } else if (bmiValue < 29.9) {
            cat = 'Overweight';
            col = 'text-yellow-500';
        } else {
            cat = 'Obesity';
            col = 'text-red-500';
        }

        return { bmi: bmiValue, category: cat, color: col };

    }, [height, weight, isMetric]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>BMI & Health Calculator</CardTitle>
                <CardDescription>Calculate your Body Mass Index (BMI).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup defaultValue="metric" onValueChange={setUnitSystem} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="metric" id="metric" />
                        <Label htmlFor="metric">Metric</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="imperial" id="imperial" />
                        <Label htmlFor="imperial">Imperial</Label>
                    </div>
                </RadioGroup>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight ({isMetric ? 'kg' : 'lbs'})</Label>
                        <Input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height ({isMetric ? 'cm' : 'in'})</Label>
                        <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <StatCard label="BMI" value={bmi > 0 ? bmi.toFixed(1) : '--'} unit="" color={color} />
                   <StatCard label="Category" value={category} unit="" color={color} />
                </div>
            </CardContent>
        </Card>
    );
}
