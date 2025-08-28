
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Download, Sparkles, FileWarning } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { useToast } from '@/hooks/use-toast';

export default function MetadataRemoverPage() {
  const [originalImage, setOriginalImage] = React.useState<string | null>(null);
  const [processedImage, setProcessedImage] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const originalFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFileName(`${originalFileName}_cleaned.png`);
      setProcessedImage(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        processImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        toast({ title: 'Invalid File', description: 'Please upload a valid image file.', variant: 'destructive' });
    }
  };

  const processImage = (imageSrc: string) => {
      setIsProcessing(true);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        toast({ title: 'Error', description: 'Canvas not supported or available.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          setProcessedImage(dataUrl);
          setIsProcessing(false);
          toast({ title: 'Image Processed', description: 'Metadata has been removed.' });
      }
      img.onerror = () => {
          toast({ title: 'Image Load Error', description: 'Could not load the image for processing.', variant: 'destructive'});
          setIsProcessing(false);
      }
      img.src = imageSrc;
  }

  const handleDownload = () => {
      if (!processedImage) return;
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-6 w-6" /> Metadata Remover</CardTitle>
          <CardDescription>Upload an image to strip its EXIF metadata for better privacy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Image</Label>
                <div className="flex items-center gap-2">
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Label htmlFor="image-upload" className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload an image</p>
                        </div>
                    </Label>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                    <Label>Original</Label>
                    <div className="border rounded-lg p-2 min-h-60 flex items-center justify-center bg-muted/50">
                        {originalImage ? <img src={originalImage} alt="Original" className="max-h-60 w-auto rounded-md"/> : <p className="text-muted-foreground text-sm">Original image will appear here</p>}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Cleaned (Metadata Removed)</Label>
                    <div className="border rounded-lg p-2 min-h-60 flex items-center justify-center bg-muted/50">
                        {isProcessing && <p>Processing...</p>}
                        {!isProcessing && processedImage && <img src={processedImage} alt="Processed" className="max-h-60 w-auto rounded-md"/>}
                        {!isProcessing && !processedImage && <p className="text-muted-foreground text-sm">Cleaned image will appear here</p>}
                    </div>
                </div>
            </div>

            <Button onClick={handleDownload} disabled={!processedImage || isProcessing}>
                <Download className="mr-2 h-4 w-4" />
                Download Cleaned Image
            </Button>
            
            <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
      
      <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>How It Works</AlertTitle>
          <AlertDescription>
            This tool works by drawing your uploaded image onto a new canvas and then exporting it. This process naturally discards all EXIF metadata. Everything is done in your browser; your images are not uploaded to any server.
          </AlertDescription>
      </Alert>

      <LegalDisclaimer />
    </div>
  );
}
