
'use server';

import { checkPasswordBreach } from '@/ai/flows/password-breach-checker';
import { type PasswordBreachCheckOutput } from '@/ai/schemas/password-breach-checker';
import { z } from 'zod';

const schema = z.object({
  password: z.string().min(1, "Please enter a password."),
});

export type BreachState = {
  data: PasswordBreachCheckOutput | null;
  message: string | null;
  fieldErrors?: {
    password?: string[];
  };
};

export async function checkPasswordBreachAction(prevState: BreachState, formData: FormData): Promise<BreachState> {
  const validatedFields = schema.safeParse({
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await checkPasswordBreach(validatedFields.data);
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred during the check: ${errorMessage}` };
  }
}
