
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight } from 'lucide-react';

const conversionFactors: Record<string, Record<string, number>> = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, ft: 0.3048, in: 0.0254 },
  mass: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
  temperature: {}, // Special handling
};

const unitLabels: Record<string, string> = {
    m: 'Meter', km: 'Kilometer', cm: 'Centimeter', mm: 'Millimeter', mi: 'Mile', ft: 'Foot', in: 'Inch',
    kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce',
    C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',
};

const unitCategories = [
    { label: 'Length', units: ['m', 'km', 'cm', 'mm', 'mi', 'ft', 'in'] },
    { label: 'Mass', units: ['kg', 'g', 'mg', 'lb', 'oz'] },
    { label: 'Temperature', units: ['C', 'F', 'K'] },
];

export default function UnitConverterPage() {
  const [category, setCategory] = React.useState('length');
  const [fromUnit, setFromUnit] = React.useState('m');
  const [toUnit, setToUnit] = React.useState('ft');
  const [input, setInput] = React.useState('1');
  const [output, setOutput] = React.useState('');

  React.useEffect(() => {
    const currentUnits = unitCategories.find(c => c.label.toLowerCase() === category)?.units || [];
    if (!currentUnits.includes(fromUnit)) setFromUnit(currentUnits[0]);
    if (!currentUnits.includes(toUnit)) setToUnit(currentUnits[1] || currentUnits[0]);
  }, [category, fromUnit, toUnit]);

  React.useEffect(() => {
    const inputValue = parseFloat(input);
    if (isNaN(inputValue)) {
      setOutput('');
      return;
    }

    if (category === 'temperature') {
        let tempInC = inputValue;
        if (fromUnit === 'F') tempInC = (inputValue - 32) * 5/9;
        if (fromUnit === 'K') tempInC = inputValue - 273.15;

        let result = tempInC;
        if (toUnit === 'F') result = (tempInC * 9/5) + 32;
        if (toUnit === 'K') result = tempInC + 273.15;
        setOutput(result.toFixed(2));

    } else {
        const factors = conversionFactors[category];
        const fromFactor = factors[fromUnit];
        const toFactor = factors[toUnit];
        if (fromFactor && toFactor) {
            const result = inputValue * fromFactor / toFactor;
            setOutput(result.toPrecision(6));
        }
    }
  }, [input, fromUnit, toUnit, category]);

  const currentUnits = unitCategories.find(c => c.label.toLowerCase() === category)?.units || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Convert between different units of measurement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              {unitCategories.map(c => <SelectItem key={c.label} value={c.label.toLowerCase()}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Label>From</Label>
            <Input type="number" value={input} onChange={e => setInput(e.target.value)} />
            <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    {currentUnits.map(u => <SelectItem key={u} value={u}>{unitLabels[u]}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <ArrowLeftRight className="mt-8"/>
          <div className="flex-1 space-y-2">
            <Label>To</Label>
            <Input value={output} readOnly />
            <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    {currentUnits.map(u => <SelectItem key={u} value={u}>{unitLabels[u]}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
