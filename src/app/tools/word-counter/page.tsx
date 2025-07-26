'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScanText } from 'lucide-react';

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
    );
}

export default function WordCounterPage() {
    const [text, setText] = React.useState('');

    const stats = React.useMemo(() => {
        const characters = text.length;
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = text.split(/\n+/).filter(Boolean).length;

        return { characters, words, sentences, paragraphs };
    }, [text]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ScanText className="h-6 w-6" /> Word & Character Counter</CardTitle>
                    <CardDescription>Analyze your text to get counts for words, characters, sentences, and paragraphs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="text-input">Your Text</Label>
                            <Textarea
                                id="text-input"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Start typing or paste your text here..."
                                className="min-h-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Words" value={stats.words} />
                            <StatCard label="Characters" value={stats.characters} />
                            <StatCard label="Sentences" value={stats.sentences} />
                            <StatCard label="Paragraphs" value={stats.paragraphs} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
