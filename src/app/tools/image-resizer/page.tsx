
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, Download, Sparkles, FileWarning, Loader2, AspectRatio, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = React.useState<HTMLImageElement | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = React.useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [quality, setQuality] = React.useState([80]);
  const [keepAspectRatio, setKeepAspectRatio] = React.useState(true);
  
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const originalFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFileName(`${originalFileName}_processed.jpg`);
      setProcessedImageUrl(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            setOriginalImage(img);
            setWidth(img.width);
            setHeight(img.height);
        }
        img.src = e.target?.result as string;
        setOriginalImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        toast({ title: 'Invalid File', description: 'Please upload a valid image file.', variant: 'destructive' });
    }
  };

  const processImage = () => {
    if (!originalImage || !canvasRef.current) return;
    setIsProcessing(true);
    
    setTimeout(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            toast({ title: 'Error', description: 'Canvas not supported or available.', variant: 'destructive' });
            setIsProcessing(false);
            return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(originalImage, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality[0] / 100);
        setProcessedImageUrl(dataUrl);
        setIsProcessing(false);
        toast({ title: 'Image Processed', description: 'Image has been resized and compressed.' });
    }, 100)
  }
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (keepAspectRatio && originalImage) {
      setHeight(Math.round((newWidth / originalImage.width) * originalImage.height));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (keepAspectRatio && originalImage) {
      setWidth(Math.round((newHeight / originalImage.height) * originalImage.width));
    }
  };

  const handleDownload = () => {
      if (!processedImageUrl) return;
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-6 w-6" /> Image Resizer & Compressor</CardTitle>
          <CardDescription>Resize image dimensions and reduce file size by adjusting quality.</CardDescription>
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
            
            {originalImage && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label>Configuration</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="width">Width</Label>
                                <Input id="width" type="number" value={width} onChange={handleWidthChange} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="height">Height</Label>
                                <Input id="height" type="number" value={height} onChange={handleHeightChange} />
                            </div>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Input type="checkbox" id="aspect-ratio" checked={keepAspectRatio} onChange={() => setKeepAspectRatio(!keepAspectRatio)} />
                            <Label htmlFor="aspect-ratio">Keep aspect ratio</Label>
                        </div>

                        <div className="space-y-2">
                            <Label>Quality: {quality[0]}%</Label>
                            <Slider value={quality} onValueChange={setQuality} max={100} step={1} />
                        </div>

                        <Button onClick={processImage} disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Process Image
                        </Button>
                    </div>
                     <div className="space-y-4">
                        <Label>Preview</Label>
                        <div className="border rounded-lg p-2 min-h-60 flex items-center justify-center bg-muted/50 aspect-video">
                            {isProcessing && <Loader2 className="h-8 w-8 animate-spin" />}
                            {processedImageUrl && !isProcessing && <img src={processedImageUrl} alt="Processed" className="max-h-full max-w-full object-contain rounded-md"/>}
                            {!processedImageUrl && !isProcessing && originalImageUrl && <img src={originalImageUrl} alt="Original" className="max-h-full max-w-full object-contain rounded-md"/>}
                            {!originalImageUrl && !isProcessing && <p className="text-muted-foreground text-sm">Preview will appear here</p>}
                        </div>
                         <Button onClick={handleDownload} disabled={!processedImageUrl || isProcessing} className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Processed Image
                        </Button>
                    </div>
                </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
      
      <Alert>
          <FileWarning className="h-4 w-4" />
          <AlertTitle>How It Works</AlertTitle>
          <AlertDescription>
            This tool uses your browser's built-in canvas API to redraw the image at your specified dimensions and quality. This process is done entirely on your computer for privacy and speed.
          </AlertDescription>
      </Alert>
    </div>
  );
}
