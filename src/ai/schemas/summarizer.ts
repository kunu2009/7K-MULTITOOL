
import { z } from 'genkit';

export const SummarizerInputSchema = z.object({
  text: z.string().describe('The text or URL to be summarized.'),
});
export type SummarizerInput = z.infer<typeof SummarizerInputSchema>;

export const SummarizerOutputSchema = z.object({
  summary: z.string().describe('The concise summary of the provided text or URL content.'),
});
export type SummarizerOutput = z.infer<typeof SummarizerOutputSchema>;
