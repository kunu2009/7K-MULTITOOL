
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function ShellRunnerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shell Command Runner (Sandboxed)</CardTitle>
        <CardDescription>Test small, safe shell commands in a sandboxed environment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Running arbitrary shell commands from a web browser is a major security risk. A truly sandboxed environment requires a complex backend infrastructure. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
