
'use server';
/**
 * @fileOverview AI-Powered Password Breach Checker Simulator.
 */

import {ai} from '@/ai/genkit';
import { PasswordBreachCheckInputSchema, PasswordBreachCheckOutputSchema, type PasswordBreachCheckInput, type PasswordBreachCheckOutput } from '@/ai/schemas/password-breach-checker';

export async function checkPasswordBreach(input: PasswordBreachCheckInput): Promise<PasswordBreachCheckOutput> {
  return passwordBreachCheckFlow(input);
}

const prompt = ai.definePrompt({
    name: 'passwordBreachCheckPrompt',
    input: {schema: PasswordBreachCheckInputSchema},
    output: {schema: PasswordBreachCheckOutputSchema},
    prompt: `You are a security expert simulating a check against the HaveIBeenPwned password database. **Do not perform a real check.**

    Password to check: {{{password}}}

    Instructions:
    1.  Analyze the password's complexity.
    2.  If the password is very simple (like "password", "123456", "qwerty"), determine that it **is pwned**. Invent a high number of times it has been seen (e.g., between 1 million and 10 million).
    3.  If the password is moderately complex (like "Password123!"), determine that it **is pwned**. Invent a moderate number of times it has been seen (e.g., between 100 and 10,000).
    4.  If the password is very complex and long (e.g., "Tr0ub4dor&3"), determine that it **is not pwned**.
    5.  Based on your determination, set the 'isPwned' boolean field.
    6.  Craft a message explaining the result. If pwned, state the number of times it has been seen in data breaches. If not pwned, congratulate the user on a strong password.
    7.  **Crucially, frame the entire response as an educational simulation.** Do not claim to have performed a real check.
    `,
});

const passwordBreachCheckFlow = ai.defineFlow(
    {
        name: 'passwordBreachCheckFlow',
        inputSchema: PasswordBreachCheckInputSchema,
        outputSchema: PasswordBreachCheckOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
