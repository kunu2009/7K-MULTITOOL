import {z} from 'genkit';

export const NumberToWordsInputSchema = z.object({
  number: z.coerce.number().describe('The number to convert to words.'),
});
export type NumberToWordsInput = z.infer<typeof NumberToWordsInputSchema>;

export const NumberToWordsOutputSchema = z.object({
  words: z.string().describe('The number expressed in words.'),
});
export type NumberToWordsOutput = z.infer<typeof NumberToWordsOutputSchema>;
