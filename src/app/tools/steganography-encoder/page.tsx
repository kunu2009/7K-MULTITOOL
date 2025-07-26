
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Eye, FileWarning, Download, Loader2 } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { useToast } from '@/hooks/use-toast';

export default function SteganographyEncoderPage() {
  const [image, setImage] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        toast({ title: 'Image loaded', description: 'Ready to encode message.' });
      };
      reader.readAsDataURL(file);
    } else {
        toast({ title: 'Invalid File', description: 'Please upload a valid image file.', variant: 'destructive' });
    }
  };

  const textToBinary = (text: string) => {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  };

  const handleEncode = () => {
    if (!image || !message || !canvasRef.current) return;
    
    setIsLoading(true);
    
    // Use a timeout to allow the UI to update to the loading state
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
                const data = imageData.data; // This is a Uint8ClampedArray
                
                const binaryMessage = textToBinary(message) + '00000000'; // Add a null terminator
                
                if (binaryMessage.length > data.length * 0.25) {
                    toast({ title: 'Error', description: 'Message is too long for this image.', variant: 'destructive' });
                    setIsLoading(false);
                    return;
                }

                for (let i = 0; i < binaryMessage.length; i++) {
                    const dataIndex = i * 4;
                    // Modify the LSB of the red channel
                    data[dataIndex] = (data[dataIndex] & 0xFE) | parseInt(binaryMessage[i], 2);
                }

                ctx.putImageData(imageData, 0, 0);
                toast({ title: 'Encoding Successful', description: 'Message hidden in the image. You can now download it.' });
                setIsLoading(false);
            };
            img.onerror = () => {
                toast({ title: 'Image Load Error', description: 'Could not load the uploaded image.', variant: 'destructive' });
                setIsLoading(false);
            }
            img.src = image;
        } catch (error) {
            console.error("Encoding error:", error);
            toast({ title: 'Encoding Failed', description: 'An unexpected error occurred during encoding.', variant: 'destructive' });
            setIsLoading(false);
        }
    }, 100);
  };
  
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    link.download = `${baseName || 'encoded'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Eye className="h-6 w-6" /> Steganography Encoder</CardTitle>
          <CardDescription>Hide a secret text message inside an image file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="image-upload">1. Upload Image (PNG is recommended)</Label>
                <div className="flex items-center gap-2">
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Label htmlFor="image-upload" className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">{fileName || "Click or drag to upload an image"}</p>
                        </div>
                    </Label>
                </div>
            </div>
            {image && (
                <div className="border rounded-lg p-4 max-h-72 overflow-hidden flex justify-center bg-secondary">
                    <img src={image} alt="Uploaded preview" className="max-h-64 h-auto w-auto object-contain rounded-md" />
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="secret-message">2. Secret Message</Label>
                <Textarea id="secret-message" placeholder="Enter the message you want to hide..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
                <Button onClick={handleEncode} disabled={!image || !message || isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Encoding...' : 'Encode Message'}
                </Button>
                <Button onClick={handleDownload} disabled={!image || isLoading} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                </Button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
      
      <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>How It Works</AlertTitle>
          <AlertDescription>
            This tool alters the least significant bit (LSB) of each pixel's color data to hide your message. The visual change is imperceptible to the human eye. The process happens entirely in your browser; your images are not uploaded to any server.
          </AlertDescription>
      </Alert>

      <LegalDisclaimer />
    </div>
  );
}
