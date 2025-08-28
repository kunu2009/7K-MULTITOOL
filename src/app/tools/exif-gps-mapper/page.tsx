
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

export default function ExifGpsMapperPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>EXIF GPS Mapper</CardTitle>
          <CardDescription>Plot the GPS locations from your photos' metadata on a map.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
              <Briefcase className="h-4 w-4"/>
              <AlertTitle>Feature Not Implemented</AlertTitle>
              <AlertDescription>
                  This tool would require a library to parse EXIF metadata from uploaded images, extract GPS coordinates, and then use a mapping API (like Leaflet or Google Maps) to display the locations. This feature is currently a placeholder.
              </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      <LegalDisclaimer />
    </div>
  );
}
