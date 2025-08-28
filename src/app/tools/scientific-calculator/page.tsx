
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ScientificCalculatorPage() {
  const [display, setDisplay] = React.useState('0');
  const [expression, setExpression] = React.useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      setExpression('');
    } else if (value === '=') {
      try {
        // Warning: eval is dangerous. This is for demo purposes only.
        // A real implementation should use a proper math expression parser.
        const result = eval(expression.replace(/%/g, '/100'));
        setDisplay(result.toString());
        setExpression(result.toString());
      } catch (e) {
        setDisplay('Error');
        setExpression('');
      }
    } else {
      if (display === '0' || display === 'Error') {
        setDisplay(value);
        setExpression(value);
      } else {
        setDisplay(display + value);
        setExpression(expression + value);
      }
    }
  };

  const buttons = [
    'C', '(', ')', '%',
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Scientific Calculator</CardTitle>
        <CardDescription>A simple scientific calculator.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md text-right text-3xl font-mono mb-4 break-all">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map(btn => (
            <Button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              variant={isNaN(Number(btn)) && btn !== '.' ? 'secondary' : 'default'}
              className="text-xl h-16"
            >
              {btn}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
