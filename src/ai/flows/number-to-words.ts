'use server';
/**
 * @fileOverview AI-Powered Number to Words Converter.
 *
 * - convertNumberToWords - A function that converts a number into its word representation.
 */

import {ai} from '@/ai/genkit';
import { NumberToWordsInputSchema, NumberToWordsOutputSchema, type NumberToWordsInput, type NumberToWordsOutput } from '@/ai/schemas/number-to-words';

export async function convertNumberToWords(input: NumberToWordsInput): Promise<NumberToWordsOutput> {
  return numberToWordsFlow(input);
}

const prompt = ai.definePrompt({
    name: 'numberToWordsPrompt',
    input: {schema: NumberToWordsInputSchema},
    output: {schema: NumberToWordsOutputSchema},
    prompt: `You are an expert at converting numbers to their English word representation.
    
    Convert the following number into words: {{{number}}}
    
    For example:
    - 123 should be "one hundred twenty-three"
    - 4567 should be "four thousand five hundred sixty-seven"
    - 1000000 should be "one million"
    
    Do not include any extra commentary, just the words for the number.
    `,
});

const numberToWordsFlow = ai.defineFlow(
    {
        name: 'numberToWordsFlow',
        inputSchema: NumberToWordsInputSchema,
        outputSchema: NumberToWordsOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
