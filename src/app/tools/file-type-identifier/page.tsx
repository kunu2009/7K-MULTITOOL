
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, PackageSearch, Loader2, FileWarning } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

// A small subset of file signatures (magic numbers)
const fileSignatures: Record<string, { sig: number[], offset?: number, mime: string, ext: string }> = {
  'jpeg': { sig: [0xFF, 0xD8, 0xFF], mime: 'image/jpeg', ext: 'jpg/jpeg' },
  'png': { sig: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], mime: 'image/png', ext: 'png' },
  'gif': { sig: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif', ext: 'gif' },
  'pdf': { sig: [0x25, 0x50, 0x44, 0x46], mime: 'application/pdf', ext: 'pdf' },
  'zip': { sig: [0x50, 0x4B, 0x03, 0x04], mime: 'application/zip', ext: 'zip' },
  'docx': { sig: [0x50, 0x4B, 0x03, 0x04], mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ext: 'docx' },
  'mp3': { sig: [0x49, 0x44, 0x33], mime: 'audio/mpeg', ext: 'mp3' },
};

export default function FileTypeIdentifierPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ type: string; mime: string; ext: string } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const identifyFileType = () => {
    if (!file) {
      toast({ title: 'No file selected', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 8);
      
      let identifiedType = 'Unknown';
      let identifiedMime = 'application/octet-stream';
      let identifiedExt = 'bin';

      for (const type in fileSignatures) {
        const { sig } = fileSignatures[type];
        const slice = arr.subarray(0, sig.length);
        if (slice.every((byte, index) => byte === sig[index])) {
          identifiedType = type;
          identifiedMime = fileSignatures[type].mime;
          identifiedExt = fileSignatures[type].ext;
          break;
        }
      }
      
      setResult({ type: identifiedType, mime: identifiedMime, ext: identifiedExt });
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast({ title: 'Error reading file', variant: 'destructive' });
      setIsLoading(false);
    }
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PackageSearch /> File Type Identifier</CardTitle>
          <CardDescription>Detect a file's true type by reading its magic bytes, not just its extension.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload a File</Label>
            <Input id="file-upload" type="file" onChange={handleFileChange} />
          </div>
          <Button onClick={identifyFileType} disabled={!file || isLoading}>
            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <PackageSearch className="mr-2" />}
            Identify File Type
          </Button>
          {result && (
            <div className="pt-4">
              <h3 className="font-semibold">Identification Result:</h3>
              <p>Detected Type: <span className="font-bold text-primary">{result.type}</span></p>
              <p>MIME Type: <span className="font-mono">{result.mime}</span></p>
              <p>Common Extension(s): <span className="font-mono">{result.ext}</span></p>
            </div>
          )}
        </CardContent>
      </Card>
      <Alert>
        <FileWarning className="h-4 w-4" />
        <AlertTitle>How It Works</AlertTitle>
        <AlertDescription>
          This tool reads the first few bytes of the uploaded file (known as "magic numbers" or a file signature) and compares them against a list of known signatures to determine the actual file type. The file is processed entirely within your browser and is not uploaded to any server.
        </AlertDescription>
      </Alert>
      <LegalDisclaimer />
    </div>
  );
}
