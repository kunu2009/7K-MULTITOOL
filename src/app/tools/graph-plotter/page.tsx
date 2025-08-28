
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export default function GraphPlotterPage() {
  const [fnString, setFnString] = React.useState('Math.sin(x)');
  const [data, setData] = React.useState<any[]>([]);

  const generateData = React.useCallback(() => {
    const newData = [];
    let expression = fnString;
    if (!expression.startsWith('Math.')) {
        expression = `Math.${expression}`
    }

    try {
      const func = new Function('x', `return ${expression}`);
      for (let i = -10; i <= 10; i += 0.5) {
        newData.push({ x: i, y: func(i) });
      }
      setData(newData);
    } catch (e) {
      console.error("Invalid function", e);
      setData([]);
    }
  }, [fnString]);

  React.useEffect(() => {
    generateData();
  }, [generateData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ChartIcon /> Graph Plotter</CardTitle>
        <CardDescription>Plot mathematical functions. Enter a JavaScript Math expression.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1.5">
                <Label htmlFor="function-input">f(x) =</Label>
                <Input id="function-input" value={fnString} onChange={(e) => setFnString(e.target.value)} placeholder="e.g., Math.sin(x) or x*x" />
            </div>
            <Button onClick={generateData}>Plot</Button>
        </div>
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
