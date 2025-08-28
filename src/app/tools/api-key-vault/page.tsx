
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Save, Download, Upload, KeyRound, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertTitle } from '@/components/ui/alert';

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

export default function ApiKeyVaultPage() {
  const [vaultContent, setVaultContent] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLocked, setIsLocked] = React.useState(true);
  const { toast } = useToast();

  const handleLock = async () => {
    if (!password) {
        toast({ title: 'Password required', variant: 'destructive' });
        return;
    }
    if (!vaultContent) {
        toast({ title: 'Vault is empty', description: 'There is nothing to encrypt.', variant: 'destructive'});
        return;
    }
    const encryptedVault = await encrypt(vaultContent, password);
    setVaultContent(encryptedVault);
    setIsLocked(true);
    toast({ title: 'Vault Encrypted & Locked!', description: 'Your data is now encrypted.' });
  };
  
  const handleUnlock = async () => {
    if (!password) {
        toast({ title: 'Password required', variant: 'destructive' });
        return;
    }
     if (!vaultContent) {
        toast({ title: 'Vault is empty', description: 'There is nothing to decrypt.', variant: 'destructive'});
        return;
    }
    try {
        const decryptedVault = await decrypt(vaultContent, password);
        setVaultContent(decryptedVault);
        setIsLocked(false);
        toast({ title: 'Vault Unlocked!', description: 'You can now view and edit your data.' });
    } catch (e) {
        toast({ title: 'Decryption Failed', description: 'The password may be incorrect or the data is corrupt.', variant: 'destructive' });
    }
  }

  const handleSave = () => {
      const blob = new Blob([vaultContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'api-key-vault.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Encrypted vault saved.', description: 'Keep your password safe to unlock it later.' });
  }

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              setVaultContent(e.target?.result as string);
              setIsLocked(true);
              toast({ title: 'Encrypted vault loaded.', description: 'Enter your password to unlock.'});
          }
          reader.readAsText(file);
      }
  }


  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><KeyRound/> API Key Vault</CardTitle>
        <CardDescription>Securely store API keys, tokens, and other secrets using client-side AES-256 encryption. Your data is never sent to any server.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="vault-area" className="flex justify-between">
            <span>Encrypted Vault</span>
            {isLocked ? <span className="text-destructive flex items-center gap-1"><Lock size={14}/> Locked</span> : <span className="text-green-600 flex items-center gap-1"><Unlock size={14}/> Unlocked</span>}
          </Label>
          <Textarea
            id="vault-area"
            value={vaultContent}
            onChange={(e) => setVaultContent(e.target.value)}
            className="min-h-[300px] font-mono mt-1"
            readOnly={isLocked && !!vaultContent}
            placeholder={isLocked ? "Vault is locked. Unlock to view or load an encrypted file." : "Store your secrets here. e.g.\n\nOPENAI_API_KEY=sk-...\nSTRIPE_SECRET_KEY=sk_live_..."}
          />
        </div>
        <div className="flex flex-wrap gap-2">
            <Label htmlFor="password-input" className="sr-only">Password</Label>
            <Input id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password to lock/unlock" className="flex-grow"/>
             <Button onClick={handleUnlock} disabled={!isLocked || !vaultContent} variant="secondary">
                <Unlock className="mr-2" /> Unlock
            </Button>
            <Button onClick={handleLock} disabled={isLocked || !vaultContent}><Lock className="mr-2" /> Lock</Button>
        </div>
         <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleSave} disabled={!isLocked || !vaultContent}><Download className="mr-2"/>Save Encrypted Vault</Button>
            <Button asChild variant="outline"><Label htmlFor="load-vault" className="cursor-pointer"><Upload className="mr-2"/>Load Encrypted Vault</Label></Button>
            <Input type="file" id="load-vault" className="hidden" onChange={handleLoad} accept=".txt"/>
        </div>
      </CardContent>
    </Card>
     <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Password Warning</AlertTitle>
        <AlertDescription>
          If you forget your password, your data cannot be recovered. There is no password reset mechanism as all encryption happens locally in your browser.
        </AlertDescription>
      </Alert>
    </div>
  );
}
