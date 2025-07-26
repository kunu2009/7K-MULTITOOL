'use server';

import { generateLoremIpsum, LoremIpsumOutput } from '@/ai/flows/lorem-ipsum-generator';
import { z } from 'zod';

const schema = z.object({
  paragraphs: z.coerce.number().min(1, "Must be at least 1.").max(20, "Cannot be more than 20."),
  wordsPerParagraph: z.coerce.number().min(10, "Must be at least 10.").max(200, "Cannot be more than 200."),
});

export type LoremIpsumState = {
  data: LoremIpsumOutput | null;
  message: string | null;
  fieldErrors?: {
    paragraphs?: string[];
    wordsPerParagraph?: string[];
  };
};

export async function generateLoremIpsumAction(prevState: LoremIpsumState, formData: FormData): Promise<LoremIpsumState> {
  const validatedFields = schema.safeParse({
    paragraphs: formData.get('paragraphs'),
    wordsPerParagraph: formData.get('wordsPerParagraph'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateLoremIpsum(validatedFields.data);
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while generating text: ${errorMessage}` };
  }
}
