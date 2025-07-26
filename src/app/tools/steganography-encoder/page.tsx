
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Eye, FileWarning } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

export default function SteganographyEncoderPage() {
  const [image, setImage] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState('');
  const [fileName, setFileName] = React.useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEncode = () => {
    // This is a simulation, so we don't actually encode the message.
    // In a real application, this would involve complex image manipulation.
    alert('This is a simulation. In a real tool, the message would be hidden in the image data. You can now "download" the original image as a demonstration.');
  };
  
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `steganography-sim-${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Eye className="h-6 w-6" /> Steganography Encoder</CardTitle>
          <CardDescription>Simulate hiding a secret message inside an image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Image</Label>
                <div className="flex items-center gap-2">
                    <Input id="image-upload" type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="hidden" />
                    <Label htmlFor="image-upload" className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">{fileName || "Click or drag to upload an image"}</p>
                        </div>
                    </Label>
                </div>
            </div>
            {image && (
                <div className="border rounded-lg p-4">
                    <img src={image} alt="Uploaded preview" className="max-w-full h-auto rounded-md mx-auto max-h-64" />
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="secret-message">Secret Message</Label>
                <Textarea id="secret-message" placeholder="Enter the message you want to hide..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
                <Button onClick={handleEncode} disabled={!image || !message}>Simulate Encoding</Button>
                <Button onClick={handleDownload} disabled={!image} variant="outline">Download Simulated Image</Button>
            </div>
        </CardContent>
      </Card>
      
       <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>This is a Simulation</AlertTitle>
          <AlertDescription>
            This tool does not perform real steganography. It is an educational demonstration to illustrate the concept of hiding data within a file. The downloaded image will not contain the secret message.
          </AlertDescription>
      </Alert>

      <LegalDisclaimer />
    </div>
  );
}
