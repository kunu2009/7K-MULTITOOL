
'use client';

import * as React from 'react';
import QRCode from "react-qr-code";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QrCodeGeneratorPage() {
    const [value, setValue] = React.useState('');
    const qrCodeRef = React.useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const handleDownload = () => {
        if (!qrCodeRef.current) {
            toast({
                title: 'Error',
                description: 'Could not get QR Code element.',
                variant: 'destructive'
            });
            return;
        }

        const svgElement = qrCodeRef.current.querySelector('svg');

        if (!svgElement) {
             toast({
                title: 'Error',
                description: 'Could not find SVG element to download.',
                variant: 'destructive'
            });
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            
            const downloadLink = document.createElement("a");
            downloadLink.download = "qrcode.png";
            downloadLink.href = pngFile;
            downloadLink.click();
            
            toast({
                title: 'Success',
                description: 'QR Code downloaded as PNG.'
            });
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><QrCode className="h-6 w-6" /> QR Code Generator</CardTitle>
                    <CardDescription>Generate a QR Code from any text or URL.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="qr-value">Text or URL</Label>
                        <Textarea
                            id="qr-value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter the text or URL to encode..."
                            className="min-h-[100px]"
                        />
                    </div>
                    
                    {value && (
                         <div className="space-y-4 flex flex-col items-center">
                            <div ref={qrCodeRef} className="bg-white p-4 rounded-lg border">
                                <QRCode
                                    value={value}
                                    size={256}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                            <Button onClick={handleDownload} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Download PNG
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
