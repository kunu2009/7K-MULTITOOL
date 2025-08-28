
import { z } from 'genkit';

export const LanguageDetectorInputSchema = z.object({
  text: z.string().describe('The text whose language needs to be detected.'),
});
export type LanguageDetectorInput = z.infer<typeof LanguageDetectorInputSchema>;

export const LanguageDetectorOutputSchema = z.object({
  language: z.string().describe('The detected language (e.g., "English", "Spanish", "Japanese").'),
  confidence: z.number().describe('The confidence score of the detection, from 0 to 100.'),
});
export type LanguageDetectorOutput = z.infer<typeof LanguageDetectorOutputSchema>;
