
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Download, FileWarning, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ImageFormatConverterPage() {
  const [originalImage, setOriginalImage] = React.useState<HTMLImageElement | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [targetFormat, setTargetFormat] = React.useState('png');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const originalFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFileName(originalFileName);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            setOriginalImage(img);
        }
        img.src = e.target?.result as string;
        setOriginalImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        toast({ title: 'Invalid File', description: 'Please upload a valid image file.', variant: 'destructive' });
    }
  };
  
  const handleDownload = () => {
    if (!originalImage || !canvasRef.current) {
        toast({ title: 'No image loaded', variant: 'destructive' });
        return;
    }
    setIsProcessing(true);
    
    setTimeout(() => {
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas not supported');

            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            ctx.drawImage(originalImage, 0, 0);

            const dataUrl = canvas.toDataURL(`image/${targetFormat}`);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${fileName}.${targetFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: 'Conversion successful!' });
        } catch (error) {
             toast({ title: 'Conversion failed', description: 'Could not convert image.', variant: 'destructive' });
        } finally {
            setIsProcessing(false);
        }
    }, 100);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Format Converter</CardTitle>
          <CardDescription>Convert images between PNG, JPG, and WebP formats.</CardDescription>
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
            
            {originalImageUrl && (
                <>
                <div className="border rounded-lg p-2 min-h-60 flex items-center justify-center bg-muted/50">
                    <img src={originalImageUrl} alt="Original" className="max-h-60 w-auto object-contain rounded-md"/>
                </div>
                 <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Target Format</Label>
                         <Select value={targetFormat} onValueChange={setTargetFormat}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="png">PNG</SelectItem>
                                <SelectItem value="jpeg">JPEG</SelectItem>
                                <SelectItem value="webp">WebP</SelectItem>
                            </SelectContent>
                         </Select>
                    </div>
                     <Button onClick={handleDownload} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Convert & Download
                    </Button>
                </div>
                </>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
      
      <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>How It Works</AlertTitle>
          <AlertDescription>
            This tool uses your browser's built-in canvas API to redraw the image in the new format. The conversion happens entirely on your computer for privacy and speed.
          </AlertDescription>
      </Alert>
    </div>
  );
}
