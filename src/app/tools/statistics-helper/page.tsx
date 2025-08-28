
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sigma } from 'lucide-react';

function ResultCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between items-center bg-secondary p-3 rounded-lg">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="font-mono text-xl font-semibold">{value}</p>
        </div>
    );
}


export default function StatisticsHelperPage() {
    const [input, setInput] = React.useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');

    const stats = React.useMemo(() => {
        const numbers = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (numbers.length === 0) return null;

        const count = numbers.length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / count;
        
        numbers.sort((a,b) => a - b);
        const mid = Math.floor(count / 2);
        const median = count % 2 !== 0 ? numbers[mid] : (numbers[mid-1] + numbers[mid]) / 2;

        const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
        const stdDev = Math.sqrt(variance);
        
        return {
            Count: count,
            Sum: sum.toFixed(2),
            Mean: mean.toFixed(2),
            Median: median.toFixed(2),
            "Standard Deviation": stdDev.toFixed(2),
            Variance: variance.toFixed(2),
            Min: Math.min(...numbers),
            Max: Math.max(...numbers),
        }
    }, [input]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sigma/> Statistics Helper</CardTitle>
                <CardDescription>Calculate basic statistics for a set of numbers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="data-input">Data (comma or space separated)</Label>
                    <Textarea
                        id="data-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., 1, 2, 3, 4, 5"
                        className="min-h-[100px] font-mono mt-1"
                    />
                </div>
                {stats && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(stats).map(([key, value]) => (
                             <ResultCard key={key} label={key} value={value} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

