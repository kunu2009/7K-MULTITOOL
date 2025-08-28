
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { convertTextToSpeechAction, TextToSpeechState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, AudioLines } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: TextToSpeechState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AudioLines className="mr-2 h-4 w-4" />}
      {pending ? 'Generating...' : 'Generate Audio'}
    </Button>
  );
}

export default function TextToSpeechPage() {
  const [state, setState] = React.useState<TextToSpeechState>(initialState);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const formAction = async (formData: FormData) => {
    const result = await convertTextToSpeechAction(initialState, formData);
    setState(result);
  };
  
  React.useEffect(() => {
    if (state.data?.audioData && audioRef.current) {
        audioRef.current.src = state.data.audioData;
        audioRef.current.play();
    }
  }, [state.data]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Text-to-Speech (TTS)</CardTitle>
          <CardDescription>Convert text into natural-sounding speech using AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="text">Text to Convert</Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Enter the text you want to hear..."
                className="mt-1 min-h-[200px]"
                required
              />
              {state.fieldErrors?.text && <p className="text-sm font-medium text-destructive mt-1">{state.fieldErrors.text.join(', ')}</p>}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.message && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.data?.audioData && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <audio ref={audioRef} controls className="w-full">
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
