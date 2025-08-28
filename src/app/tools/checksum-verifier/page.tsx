
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Hash, CheckCircle, XCircle, FileCheck2, Loader2, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type FileStatus = 'pending' | 'hashing' | 'verifying' | 'match' | 'mismatch' | 'error';
type FileWithHash = {
    file: File;
    name: string;
    expectedHash: string;
    actualHash?: string;
    status: FileStatus;
};

async function generateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


export default function ChecksumVerifierPage() {
  const [files, setFiles] = React.useState<FileWithHash[]>([]);
  const [hashes, setHashes] = React.useState('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
        const newFiles: FileWithHash[] = Array.from(selectedFiles).map(file => ({
            file,
            name: file.name,
            expectedHash: '',
            status: 'pending'
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleHashesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHashes(e.target.value);
      const hashLines = e.target.value.split('\n').map(line => line.trim().toLowerCase());
      
      setFiles(currentFiles => {
          return currentFiles.map(file => {
              const hashLine = hashLines.find(line => line.endsWith(file.name.toLowerCase()));
              if(hashLine) {
                  const expectedHash = hashLine.split(/\s+/)[0];
                  return { ...file, expectedHash };
              }
              return file;
          });
      })
  }
  
  const handleVerifyAll = async () => {
    if (files.length === 0) {
        toast({title: "No files added.", variant: "destructive"});
        return;
    }
    
    setFiles(files.map(f => ({...f, status: 'hashing'})));

    for (const file of files) {
        if (!file.expectedHash) {
            setFiles(prev => prev.map(f => f.name === file.name ? {...f, status: 'error'} : f));
            continue;
        }

        const actualHash = await generateHash(file.file);
        const status: FileStatus = actualHash === file.expectedHash ? 'match' : 'mismatch';
        
        setFiles(prev => prev.map(f => f.name === file.name ? {...f, status, actualHash} : f));
    }
    toast({title: "Verification complete!"});
  }
  
  const clearAll = () => {
      setFiles([]);
      setHashes('');
  }

  const renderStatusIcon = (status: FileStatus) => {
    switch (status) {
        case 'pending': return <Hash className="text-muted-foreground" />;
        case 'hashing': return <Loader2 className="animate-spin" />;
        case 'match': return <CheckCircle className="text-green-500" />;
        case 'mismatch': return <XCircle className="text-red-500" />;
        case 'error': return <XCircle className="text-red-500" />;
        default: return null;
    }
  }

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileCheck2/> Checksum Batch Verifier</CardTitle>
        <CardDescription>Verify the integrity of multiple files at once by providing a list of SHA-256 hashes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="file-upload">1. Upload Files</Label>
                <Input id="file-upload" type="file" onChange={handleFileChange} multiple className="mt-1"/>
            </div>
             <div>
                <Label htmlFor="hashes">2. Paste Hashes</Label>
                <textarea 
                    id="hashes" 
                    value={hashes}
                    onChange={handleHashesChange}
                    placeholder="Paste checksums here, e.g.&#10;e3b0c442...  file1.zip&#10;a1b2c3d4...  file2.txt"
                    className="w-full h-32 p-2 mt-1 border rounded-md font-mono text-sm bg-muted"
                />
            </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleVerifyAll} disabled={files.length === 0}>Verify All</Button>
            <Button variant="ghost" onClick={clearAll}><Trash2 className="mr-2"/>Clear All</Button>
        </div>
        
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">Status</TableHead>
                        <TableHead>Filename</TableHead>
                        <TableHead>Expected Hash</TableHead>
                        <TableHead>Actual Hash</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files.map(f => (
                         <TableRow key={f.name}>
                            <TableCell className="text-center">{renderStatusIcon(f.status)}</TableCell>
                            <TableCell>{f.name}</TableCell>
                            <TableCell className="font-mono text-xs">{f.expectedHash || 'Not found'}</TableCell>
                            <TableCell className="font-mono text-xs">{f.actualHash || 'Not yet calculated'}</TableCell>
                        </TableRow>
                    ))}
                    {files.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Upload files and paste hashes to begin.</TableCell></TableRow>}
                </TableBody>
            </Table>
        </Card>

      </CardContent>
    </Card>
    </div>
  );
}
