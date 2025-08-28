
'use server';

import { detectLanguage } from '@/ai/flows/language-detector';
import { type LanguageDetectorOutput } from '@/ai/schemas/language-detector';
import { z } from 'zod';

const schema = z.object({
  text: z.string().min(5, 'Please enter at least 5 characters.'),
});

export type LanguageDetectorState = {
  data: LanguageDetectorOutput | null;
  message: string | null;
  fieldErrors?: {
    text?: string[];
  };
};

export async function detectLanguageAction(prevState: LanguageDetectorState, formData: FormData): Promise<LanguageDetectorState> {
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
    const result = await detectLanguage({ text: validatedFields.data.text });
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred during detection: ${errorMessage}` };
  }
}
