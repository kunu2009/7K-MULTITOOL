
'use server';
/**
 * @fileOverview AI-Powered Synonym Finder.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const SynonymFinderInputSchema = z.object({
  word: z.string().describe('The word to find synonyms for.'),
});
export type SynonymFinderInput = z.infer<typeof SynonymFinderInputSchema>;

export const SynonymFinderOutputSchema = z.object({
  synonyms: z.array(z.string()).describe('A list of synonyms for the given word.'),
});
export type SynonymFinderOutput = z.infer<typeof SynonymFinderOutputSchema>;

export async function findSynonyms(input: SynonymFinderInput): Promise<SynonymFinderOutput> {
  return synonymFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'synonymFinderPrompt',
  input: { schema: SynonymFinderInputSchema },
  output: { schema: SynonymFinderOutputSchema },
  prompt: `You are an expert thesaurus. Provide a list of the most relevant synonyms for the following word: {{{word}}}.`,
});

const synonymFinderFlow = ai.defineFlow(
  {
    name: 'synonymFinderFlow',
    inputSchema: SynonymFinderInputSchema,
    outputSchema: SynonymFinderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
