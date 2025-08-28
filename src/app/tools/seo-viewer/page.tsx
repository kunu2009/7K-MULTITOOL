
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function SeoViewerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Robots.txt & Sitemap Viewer</CardTitle>
        <CardDescription>Quickly view the SEO configuration files for any website.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Briefcase className="h-4 w-4"/>
            <AlertTitle>Feature Not Implemented</AlertTitle>
            <AlertDescription>
                Fetching and parsing these files from arbitrary URLs can be blocked by CORS policies. A reliable implementation requires a backend proxy. This feature is a placeholder.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
