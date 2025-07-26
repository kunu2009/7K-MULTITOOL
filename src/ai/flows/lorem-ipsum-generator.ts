'use server';
/**
 * @fileOverview AI-Powered Lorem Ipsum Generator.
 *
 * - generateLoremIpsum - A function that generates placeholder text.
 * - LoremIpsumInput - The input type for the function.
 * - LoremIpsumOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LoremIpsumInputSchema = z.object({
  paragraphs: z.number().min(1).max(20).describe('The number of paragraphs to generate.'),
  wordsPerParagraph: z.number().min(10).max(200).describe('The approximate number of words per paragraph.'),
});
export type LoremIpsumInput = z.infer<typeof LoremIpsumInputSchema>;

const LoremIpsumOutputSchema = z.object({
  text: z.string().describe('The generated Lorem Ipsum text.'),
});
export type LoremIpsumOutput = z.infer<typeof LoremIpsumOutputSchema>;

export async function generateLoremIpsum(input: LoremIpsumInput): Promise<LoremIpsumOutput> {
  return loremIpsumFlow(input);
}

const prompt = ai.definePrompt({
  name: 'loremIpsumPrompt',
  input: {schema: LoremIpsumInputSchema},
  output: {schema: LoremIpsumOutputSchema},
  prompt: `Generate a Lorem Ipsum style placeholder text.

  Number of paragraphs: {{{paragraphs}}}
  Approximate words per paragraph: {{{wordsPerParagraph}}}
  
  The text should be in the traditional Latin-like style of Lorem Ipsum.
  Start with "Lorem ipsum dolor sit amet...".
  Each paragraph should be separated by a double newline character.
  `,
});

const loremIpsumFlow = ai.defineFlow(
  {
    name: 'loremIpsumFlow',
    inputSchema: LoremIpsumInputSchema,
    outputSchema: LoremIpsumOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
