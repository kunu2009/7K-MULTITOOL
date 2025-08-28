
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Hash } from 'lucide-react';

async function generateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function FileIntegrityCheckerPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [generatedHash, setGeneratedHash] = React.useState('');
  const [hashToCheck, setHashToCheck] = React.useState('');
  const [isMatch, setIsMatch] = React.useState<boolean | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const hash = await generateHash(selectedFile);
      setGeneratedHash(hash);
      setIsMatch(null);
    }
  };

  const handleCheck = () => {
    if (!generatedHash || !hashToCheck) {
        toast({title: "Input missing", description: "Please provide a file and a hash to check.", variant: "destructive"})
        return;
    };
    const match = generatedHash.toLowerCase() === hashToCheck.toLowerCase();
    setIsMatch(match);
    toast({title: match ? "Hashes match!" : "Hashes do NOT match!", variant: match ? 'default' : 'destructive'})
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Integrity Checker (SHA-256)</CardTitle>
        <CardDescription>Generate a checksum for a file or verify it against a known hash.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Upload File</Label>
          <Input id="file-upload" type="file" onChange={handleFileChange} />
        </div>
        {generatedHash && (
          <div className="space-y-2">
            <Label>Generated Hash</Label>
            <p className="font-mono text-sm break-all bg-muted p-2 rounded-md">{generatedHash}</p>
          </div>
        )}
        <div className="space-y-2">
            <Label htmlFor="hash-check">Hash to Verify Against</Label>
            <Input id="hash-check" value={hashToCheck} onChange={e => setHashToCheck(e.target.value)} placeholder="Paste SHA-256 hash here" />
        </div>
        <Button onClick={handleCheck} disabled={!file || !hashToCheck}>Check Integrity</Button>
        {isMatch !== null && (
            <p className={`font-bold ${isMatch ? 'text-green-500' : 'text-red-500'}`}>
                {isMatch ? "✅ Match" : "❌ No Match"}
            </p>
        )}
      </CardContent>
    </Card>
  );
}
