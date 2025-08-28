
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const soundEffects = [
    { name: 'Applause', url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_32b0a47362.mp3' },
    { name: 'Drum Roll', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_51a4697f9c.mp3' },
    { name: 'Success', url: 'https://cdn.pixabay.com/audio/2022/11/17/audio_88f6c40628.mp3' },
    { name: 'Wrong Buzzer', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3de595780.mp3' },
    { name: 'Magic Wand', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_55160a2d26.mp3' },
    { name: 'Cartoon Slip', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2855755dsp.mp3' },
    { name: 'Record Scratch', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_731c50a490.mp3' },
    { name: 'Camera Shutter', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_450c900609.mp3' },
];

export default function SoundboardPage() {
    const { toast } = useToast();

    const playSound = (url: string) => {
        try {
            const audio = new Audio(url);
            audio.play();
        } catch (error) {
            toast({
                title: 'Error playing sound',
                variant: 'destructive'
            });
        }
    };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Soundboard</CardTitle>
        <CardDescription>Play quick sound effects for streams or fun.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {soundEffects.map(sound => (
            <Button 
                key={sound.name}
                onClick={() => playSound(sound.url)}
                className="h-20 text-lg"
            >
                {sound.name}
            </Button>
        ))}
      </CardContent>
    </Card>
  );
}
