
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Copy, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// In a real app, you'd want to check for window.SpeechRecognition || window.webkitSpeechRecognition
const SpeechRecognition = (typeof window !== 'undefined') && (window.SpeechRecognition || (window as any).webkitSpeechRecognition);

export default function SpeechToTextPage() {
  const [transcript, setTranscript] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!SpeechRecognition) {
      toast({ title: 'Not Supported', description: 'Your browser does not support the Web Speech API.', variant: 'destructive' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Update the main transcript with the latest final results
      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
      toast({ title: 'Recognition Error', description: event.error, variant: 'destructive' });
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    toast({ title: 'Copied to clipboard' });
  };
  
  const handleClear = () => {
    setTranscript('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech-to-Text</CardTitle>
        <CardDescription>Click the microphone to start and stop dictating.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        { !SpeechRecognition && <Alert variant="destructive"><AlertTitle>Browser Not Supported</AlertTitle><AlertDescription>This feature requires the Web Speech API, which is not available in your browser.</AlertDescription></Alert> }
        
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your transcribed text will appear here..."
          className="min-h-[300px]"
        />
        <div className="flex flex-wrap gap-2">
            <Button onClick={toggleListening} disabled={!SpeechRecognition}>
              {isListening ? <><MicOff className="mr-2"/>Stop Listening</> : <><Mic className="mr-2"/>Start Listening</>}
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!transcript}><Copy className="mr-2"/>Copy</Button>
            <Button variant="ghost" onClick={handleClear} disabled={!transcript}><Trash2 className="mr-2"/>Clear</Button>
        </div>
      </CardContent>
    </Card>
  );
}
