
'use server';

import { generateFakeData } from '@/ai/flows/fake-data-generator';
import { type FakeDataOutput } from '@/ai/schemas/fake-data-generator';

export type FakeDataState = {
  data: FakeDataOutput | null;
  message: string | null;
};

export async function generateFakeDataAction(prevState: FakeDataState, formData: FormData): Promise<FakeDataState> {
  try {
    const result = await generateFakeData();
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while generating data: ${errorMessage}` };
  }
}
