
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ColorPickerPage() {
  const [color, setColor] = React.useState('#29abe2');
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', description: text });
  };

  const toRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : 'Invalid HEX';
  };
  
  const toHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        r = parseInt(result[1], 16);
        g = parseInt(result[2], 16);
        b = parseInt(result[3], 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  const rgbValue = toRgb(color);
  const hslValue = toHsl(color);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Picker</CardTitle>
        <CardDescription>Select a color to see its different format values.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-48 h-48 p-0 border-none cursor-pointer"
          aria-label="Color Picker"
        />
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <Label>HEX</Label>
            <div className="flex items-center gap-2">
              <Input value={color} readOnly className="font-mono" />
              <Button size="icon" variant="outline" onClick={() => handleCopy(color)}><Copy /></Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>RGB</Label>
            <div className="flex items-center gap-2">
              <Input value={rgbValue} readOnly className="font-mono" />
              <Button size="icon" variant="outline" onClick={() => handleCopy(rgbValue)}><Copy /></Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>HSL</Label>
            <div className="flex items-center gap-2">
                <Input value={hslValue} readOnly className="font-mono" />
                <Button size="icon" variant="outline" onClick={() => handleCopy(hslValue)}><Copy /></Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
