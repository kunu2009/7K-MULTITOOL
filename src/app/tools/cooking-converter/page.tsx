
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight } from 'lucide-react';

const ingredients: Record<string, number> = {
  'flour': 120,
  'sugar': 200,
  'butter': 227,
  'water': 236,
  'milk': 244,
  'oil': 224,
};

const volumeUnits: Record<string, number> = {
  'cup': 1,
  'tbsp': 16,
  'tsp': 48,
  'ml': 236.588,
};

const weightUnits: Record<string, number> = {
  'g': 1,
  'oz': 0.035274,
};

export default function CookingConverterPage() {
  const [ingredient, setIngredient] = React.useState('flour');
  const [inputVal, setInputVal] = React.useState('1');
  const [fromUnit, setFromUnit] = React.useState('cup');
  const [toUnit, setToUnit] = React.useState('g');
  const [outputVal, setOutputVal] = React.useState('');
  
  React.useEffect(() => {
    const val = parseFloat(inputVal);
    if (isNaN(val)) return;

    let baseGrams;
    // Convert input to grams
    if (volumeUnits[fromUnit]) { // from volume to weight
      const gramsPerCup = ingredients[ingredient];
      const cups = val / volumeUnits[fromUnit];
      baseGrams = cups * gramsPerCup;
    } else { // from weight to weight
      baseGrams = val / weightUnits[fromUnit];
    }
    
    let result;
    // Convert grams to output unit
    if (volumeUnits[toUnit]) { // to volume
      const gramsPerCup = ingredients[ingredient];
      const cups = baseGrams / gramsPerCup;
      result = cups * volumeUnits[toUnit];
    } else { // to weight
      result = baseGrams * weightUnits[toUnit];
    }
    
    setOutputVal(result.toFixed(2));
  }, [inputVal, fromUnit, toUnit, ingredient]);

  const allUnits = [...Object.keys(volumeUnits), ...Object.keys(weightUnits)];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cooking Converter</CardTitle>
        <CardDescription>Convert between common cooking units for different ingredients.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="space-y-2">
          <Label>Ingredient</Label>
          <Select value={ingredient} onValueChange={setIngredient}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              {Object.keys(ingredients).map(i => <SelectItem key={i} value={i} className="capitalize">{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Label>From</Label>
            <Input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} />
            <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    {allUnits.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <ArrowLeftRight className="mt-8"/>
          <div className="flex-1 space-y-2">
            <Label>To</Label>
            <Input value={outputVal} readOnly />
            <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    {allUnits.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-4">Note: This converter uses standard approximations. Ingredient densities can vary.</p>
      </CardContent>
    </Card>
  );
}
