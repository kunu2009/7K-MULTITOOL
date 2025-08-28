
'use server';
/**
 * @fileOverview AI-Powered Language Detector flow.
 */

import { ai } from '@/ai/genkit';
import { LanguageDetectorInputSchema, LanguageDetectorOutputSchema, type LanguageDetectorInput, type LanguageDetectorOutput } from '@/ai/schemas/language-detector';

export async function detectLanguage(input: LanguageDetectorInput): Promise<LanguageDetectorOutput> {
  return languageDetectorFlow(input);
}

const prompt = ai.definePrompt({
    name: 'languageDetectorPrompt',
    input: { schema: LanguageDetectorInputSchema },
    output: { schema: LanguageDetectorOutputSchema },
    prompt: `You are a language detection expert. Analyze the following text and identify the language it is written in. Provide the language name and your confidence level as a percentage.

    Text:
    {{{text}}}
    `,
});

const languageDetectorFlow = ai.defineFlow(
    {
        name: 'languageDetectorFlow',
        inputSchema: LanguageDetectorInputSchema,
        outputSchema: LanguageDetectorOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
