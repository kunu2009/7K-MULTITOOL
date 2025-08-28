
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Save, Download, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(text: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(text)
  );
  const encryptedBytes = new Uint8Array(encrypted);
  const result = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
  result.set(salt);
  result.set(iv, salt.length);
  result.set(encryptedBytes, salt.length + iv.length);
  return btoa(String.fromCharCode.apply(null, Array.from(result)));
}

async function decrypt(encryptedBase64: string, password: string): Promise<string> {
  const data = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  const key = await getKey(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  return new TextDecoder().decode(decrypted);
}


export default function SecureNotesPage() {
  const [note, setNote] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLocked, setIsLocked] = React.useState(true);
  const { toast } = useToast();

  const handleLock = async () => {
    if (!password) {
        toast({ title: 'Password required', variant: 'destructive' });
        return;
    }
    const encryptedNote = await encrypt(note, password);
    setNote(encryptedNote);
    setIsLocked(true);
    toast({ title: 'Note encrypted and locked!' });
  };
  
  const handleUnlock = async () => {
    if (!password) {
        toast({ title: 'Password required', variant: 'destructive' });
        return;
    }
    try {
        const decryptedNote = await decrypt(note, password);
        setNote(decryptedNote);
        setIsLocked(false);
        toast({ title: 'Note unlocked!' });
    } catch (e) {
        toast({ title: 'Decryption failed. Check your password.', variant: 'destructive' });
    }
  }

  const handleSave = () => {
      const blob = new Blob([note], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'secure-note.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Note saved. Keep your password safe!' });
  }

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              setNote(e.target?.result as string);
              setIsLocked(true);
          }
          reader.readAsText(file);
      }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Client-Side Encrypted Notes</CardTitle>
        <CardDescription>Your notes are encrypted in your browser. Nothing is sent to any server.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="note-area">Your Note</Label>
          <Textarea
            id="note-area"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[300px] font-mono mt-1"
            readOnly={isLocked}
          />
        </div>
        <div className="flex gap-2">
            <Label htmlFor="password-input" className="sr-only">Password</Label>
            <Input id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" disabled={!isLocked}>
                        <Unlock className="mr-2" /> Unlock
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unlock Note</DialogTitle>
                        <DialogDescription>Enter your password to decrypt and view the note.</DialogDescription>
                    </DialogHeader>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
                    <DialogFooter>
                        <Button onClick={handleUnlock}>Unlock</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button onClick={handleLock} disabled={isLocked}><Lock className="mr-2" /> Lock</Button>
        </div>
         <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} disabled={!isLocked || !note}><Download className="mr-2"/>Save Encrypted Note</Button>
            <Input type="file" id="load-note" className="hidden" onChange={handleLoad} accept=".txt"/>
            <Button asChild variant="outline"><Label htmlFor="load-note" className="cursor-pointer"><Upload className="mr-2"/>Load Encrypted Note</Label></Button>
        </div>
      </CardContent>
    </Card>
  );
}
