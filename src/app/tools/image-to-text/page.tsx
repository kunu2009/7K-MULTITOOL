
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Scan, Copy } from 'lucide-react';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OcrOutputSchema = z.object({
  extractedText: z.string().describe("The text extracted from the image."),
});
type OcrOutput = z.infer<typeof OcrOutputSchema>;

export default function ImageToTextPage() {
  const [image, setImage] = React.useState<string | null>(null);
  const [extractedText, setExtractedText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOcr = async () => {
    if (!image) {
      toast({ title: "Please upload an image first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setExtractedText('');

    try {
      const ocrPrompt = ai.definePrompt({
        name: 'ocrPrompt',
        input: { schema: z.object({ photoDataUri: z.string() }) },
        output: { schema: OcrOutputSchema },
        prompt: `Extract all text from the following image.
        Photo: {{media url=photoDataUri}}`,
      });

      const { output } = await ocrPrompt({ photoDataUri: image });
      if (output) {
        setExtractedText(output.extractedText);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'OCR Failed', description: 'Could not extract text from the image.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast({ title: 'Copied to clipboard' });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Image to Text (OCR)</CardTitle>
        <CardDescription>Extract text from any image using AI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
          <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        {image && <img src={image} alt="Preview" className="max-w-full h-auto rounded-md border" />}
        <Button onClick={handleOcr} disabled={!image || isLoading}>
          {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Scan className="mr-2" />}
          Extract Text
        </Button>
        <div className="space-y-2">
          <Label>Extracted Text</Label>
           <div className="relative">
            <Textarea value={extractedText} readOnly className="min-h-[200px]" />
            {extractedText && <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}><Copy/></Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
