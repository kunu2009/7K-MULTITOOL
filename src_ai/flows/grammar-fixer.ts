
'use server';
/**
 * @fileOverview AI-Powered Grammar and Typos Fixer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GrammarFixerInputSchema = z.object({
  text: z.string().describe('The text to be corrected.'),
});
export type GrammarFixerInput = z.infer<typeof GrammarFixerInputSchema>;

export const GrammarFixerOutputSchema = z.object({
  correctedText: z.string().describe('The corrected version of the text.'),
});
export type GrammarFixerOutput = z.infer<typeof GrammarFixerOutputSchema>;

export async function fixGrammar(input: GrammarFixerInput): Promise<GrammarFixerOutput> {
  return grammarFixerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'grammarFixerPrompt',
  input: { schema: GrammarFixerInputSchema },
  output: { schema: GrammarFixerOutputSchema },
  prompt: `You are an expert in English grammar and spelling. Correct the following text, fixing all spelling mistakes, grammatical errors, and typos. Only return the corrected text, without any commentary or explanations.

Text to correct:
{{{text}}}
`,
});

const grammarFixerFlow = ai.defineFlow(
  {
    name: 'grammarFixerFlow',
    inputSchema: GrammarFixerInputSchema,
    outputSchema: GrammarFixerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
