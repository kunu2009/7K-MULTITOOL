
'use client';

import * as React from 'react';
import QRCode from "react-qr-code";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function WifiQrGeneratorPage() {
    const [ssid, setSsid] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [encryption, setEncryption] = React.useState('WPA');
    const qrCodeRef = React.useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const qrValue = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

    const handleDownload = () => {
        if (!qrCodeRef.current) {
            toast({ title: 'Error', description: 'Could not get QR Code element.', variant: 'destructive' });
            return;
        }

        const svgElement = qrCodeRef.current.querySelector('svg');
        if (!svgElement) return;

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
            downloadLink.download = `${ssid}-wifi-qr.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
            
            toast({ title: 'Success', description: 'QR Code downloaded as PNG.' });
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wifi className="h-6 w-6" /> Wi-Fi QR Code Generator</CardTitle>
                <CardDescription>Generate a QR Code to easily share your Wi-Fi credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ssid">Network Name (SSID)</Label>
                        <Input id="ssid" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="e.g., MyHomeNetwork" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Encryption Type</Label>
                    <Select value={encryption} onValueChange={setEncryption}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">None</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                
                {ssid && (
                     <div className="space-y-4 flex flex-col items-center">
                        <div ref={qrCodeRef} className="bg-white p-4 rounded-lg border">
                            <QRCode value={qrValue} size={256} viewBox={`0 0 256 256`} />
                        </div>
                        <Button onClick={handleDownload} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download PNG
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
