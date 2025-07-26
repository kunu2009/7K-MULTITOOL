
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Key, FileWarning, Loader2 } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { useToast } from '@/hooks/use-toast';

export default function SteganographyDecoderPage() {
  const [image, setImage] = React.useState<string | null>(null);
  const [decodedMessage, setDecodedMessage] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setDecodedMessage('');
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        toast({ title: 'Image loaded', description: 'Ready to decode message.' });
      };
      reader.readAsDataURL(file);
    } else {
        toast({ title: 'Invalid File', description: 'Please upload a valid image file.', variant: 'destructive' });
    }
  };

  const binaryToText = (binary: string) => {
    let text = '';
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substring(i, i + 8);
      if (byte === '00000000') break; // Null terminator
      text += String.fromCharCode(parseInt(byte, 2));
    }
    return text;
  };

  const handleDecode = () => {
    if (!image || !canvasRef.current) return;

    setIsLoading(true);

    setTimeout(() => {
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                toast({ title: 'Canvas Error', description: 'Could not get canvas context.', variant: 'destructive' });
                setIsLoading(false);
                return;
            }

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                let binaryMessage = '';
                for (let i = 0; i < data.length; i += 4) {
                    const lsb = data[i] & 1; // Get LSB of the red channel
                    binaryMessage += lsb;
                }

                const decoded = binaryToText(binaryMessage);
                setDecodedMessage(decoded);
                
                if (decoded) {
                    toast({ title: 'Decoding Successful', description: 'Found a hidden message.' });
                } else {
                    toast({ title: 'No Message Found', description: 'Could not detect a hidden message in this image.', variant: 'destructive'});
                }
                setIsLoading(false);
            };
            img.onerror = () => {
                 toast({ title: 'Image Load Error', description: 'Could not load the uploaded image.', variant: 'destructive' });
                 setIsLoading(false);
            }
            img.src = image;
        } catch (error) {
            console.error("Decoding error:", error);
            toast({ title: 'Decoding Failed', description: 'An unexpected error occurred during decoding.', variant: 'destructive' });
            setIsLoading(false);
        }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Key className="h-6 w-6" /> Steganography Decoder</CardTitle>
          <CardDescription>Extract a secret text message from an image file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="image-upload">1. Upload Image</Label>
                <div className="flex items-center gap-2">
                    <Input id="image-upload" type="file" accept="image/png" onChange={handleImageUpload} className="hidden" />
                    <Label htmlFor="image-upload" className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">{fileName || "Click or drag to upload an image with a hidden message"}</p>
                        </div>
                    </Label>
                </div>
            </div>
            
            <Button onClick={handleDecode} disabled={!image || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                {isLoading ? 'Decoding...' : 'Decode Message'}
            </Button>

            <div className="space-y-2">
                <Label htmlFor="decoded-message">2. Decoded Message</Label>
                <Textarea id="decoded-message" placeholder="Hidden message will appear here..." value={decodedMessage} readOnly className="min-h-[150px] bg-muted"/>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
      
      <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Compatibility Note</AlertTitle>
          <AlertDescription>
            This decoder is designed to work with images created by this app's own Steganography Encoder. It may not work with images encoded by other tools, as they might use different algorithms.
          </AlertDescription>
      </Alert>

      <LegalDisclaimer />
    </div>
  );
}

