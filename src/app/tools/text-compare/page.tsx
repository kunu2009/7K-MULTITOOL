
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { diffChars } from 'diff';

export default function TextComparePage() {
  const [textA, setTextA] = React.useState('');
  const [textB, setTextB] = React.useState('');

  const differences = diffChars(textA, textB);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Compare / Diff Tool</CardTitle>
        <CardDescription>Compare two pieces of text to see the differences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Text A"
            className="min-h-[300px] font-mono"
          />
          <Textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Text B"
            className="min-h-[300px] font-mono"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Differences</h3>
          <div className="p-4 border rounded-md min-h-[100px] bg-muted whitespace-pre-wrap font-mono">
            {differences.map((part, index) => {
              const color = part.added ? 'bg-green-500/20' : part.removed ? 'bg-red-500/20' : 'transparent';
              return (
                <span key={index} className={color}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
