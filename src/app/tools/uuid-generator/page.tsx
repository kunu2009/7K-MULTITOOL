
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Clipboard, FingerprintIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UuidGeneratorPage() {
    const [uuid, setUuid] = React.useState('');
    const { toast } = useToast();

    const generateUuid = React.useCallback(() => {
        setUuid(crypto.randomUUID());
    }, []);

    // Generate a UUID on initial component mount
    React.useEffect(() => {
        generateUuid();
    }, [generateUuid]);

    const handleCopy = () => {
        if (uuid) {
            navigator.clipboard.writeText(uuid);
            toast({
                title: 'Copied to Clipboard',
                description: 'The UUID has been copied.',
            });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FingerprintIcon className="h-6 w-6" /> UUID Generator</CardTitle>
                    <CardDescription>Generate universally unique identifiers (version 4).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            id="uuid-output"
                            value={uuid}
                            readOnly
                            placeholder="Your UUID will appear here"
                            className="font-mono text-lg"
                        />
                         <Button onClick={handleCopy} variant="outline" size="icon" aria-label="Copy UUID">
                            <Clipboard className="h-5 w-5" />
                        </Button>
                        <Button onClick={generateUuid} variant="outline" size="icon" aria-label="Generate new UUID">
                            <RefreshCw className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        This tool generates a Version 4 UUID, which is created using random numbers.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
