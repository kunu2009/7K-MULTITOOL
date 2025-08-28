
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeftRight } from 'lucide-react';

function jsonToCsv(json: any[]): string {
    const headers = Object.keys(json[0]);
    const csvRows = [headers.join(',')];
    for (const row of json) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
}

function csvToJson(csv: string): any[] {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
        const obj: any = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

export default function DataConverterPage() {
  const [jsonText, setJsonText] = React.useState('');
  const [csvText, setCsvText] = React.useState('');

  const handleJsonToCsv = () => {
    try {
      if (!jsonText) {
          toast({ title: 'JSON is empty', variant: 'destructive' });
          return
      };
      const parsed = JSON.parse(jsonText);
      setCsvText(jsonToCsv(parsed));
    } catch (e) {
      toast({ title: 'Invalid JSON', variant: 'destructive' });
    }
  };

  const handleCsvToJson = () => {
    try {
        if (!csvText) {
            toast({ title: 'CSV is empty', variant: 'destructive' });
            return;
        }
      const json = csvToJson(csvText);
      setJsonText(JSON.stringify(json, null, 2));
    } catch (e) {
      toast({ title: 'Invalid CSV', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JSON <> CSV Converter</CardTitle>
          <CardDescription>Convert data between JSON and CSV formats.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="json-text">JSON</Label>
              <Textarea
                id="json-text"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='[{"id":1,"name":"John"}]'
                className="min-h-[300px] font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleJsonToCsv} size="icon"><ArrowLeftRight className="h-4 w-4 -scale-x-100" /></Button>
              <Button onClick={handleCsvToJson} size="icon" variant="outline"><ArrowLeftRight className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="csv-text">CSV</Label>
              <Textarea
                id="csv-text"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={'id,name\n1,John'}
                className="min-h-[300px] font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
