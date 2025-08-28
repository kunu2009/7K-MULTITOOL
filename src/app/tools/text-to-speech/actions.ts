
'use server';

import { textToSpeech } from '@/ai/flows/text-to-speech';
import { type TextToSpeechOutput } from '@/ai/schemas/text-to-speech';
import { z } from 'zod';

const schema = z.object({
  text: z.string().min(1, 'Please enter some text.').max(1000, 'Text cannot exceed 1000 characters.'),
});

export type TextToSpeechState = {
  data: TextToSpeechOutput | null;
  message: string | null;
  fieldErrors?: {
    text?: string[];
  };
};

export async function convertTextToSpeechAction(prevState: TextToSpeechState, formData: FormData): Promise<TextToSpeechState> {
  const validatedFields = schema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await textToSpeech({ text: validatedFields.data.text });
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while generating audio: ${errorMessage}` };
  }
}
