
'use server';

import { summarizeText } from '@/ai/flows/summarizer';
import { type SummarizerOutput } from '@/ai/schemas/summarizer';
import { z } from 'zod';

const schema = z.object({
  text: z.string().min(20, 'Please enter at least 20 characters of text or a valid URL.'),
});

export type SummarizerState = {
  data: SummarizerOutput | null;
  message: string | null;
  fieldErrors?: {
    text?: string[];
  };
};

export async function summarizeTextAction(prevState: SummarizerState, formData: FormData): Promise<SummarizerState> {
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
    const result = await summarizeText({ text: validatedFields.data.text });
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while summarizing: ${errorMessage}` };
  }
}
