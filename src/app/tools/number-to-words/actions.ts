'use server';

import { convertNumberToWords } from '@/ai/flows/number-to-words';
import { NumberToWordsInputSchema, type NumberToWordsOutput } from '@/ai/schemas/number-to-words';
import { z } from 'zod';

export type NumberToWordsState = {
  data: NumberToWordsOutput | null;
  message: string | null;
  fieldErrors?: {
    number?: string[];
  };
};

export async function convertNumberAction(prevState: NumberToWordsState, formData: FormData): Promise<NumberToWordsState> {
  const validatedFields = NumberToWordsInputSchema.safeParse({
    number: formData.get('number'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await convertNumberToWords(validatedFields.data);
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred during conversion: ${errorMessage}` };
  }
}
