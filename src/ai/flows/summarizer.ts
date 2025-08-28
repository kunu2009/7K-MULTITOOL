
'use server';
/**
 * @fileOverview AI-Powered Text Summarizer flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SummarizerInputSchema, SummarizerOutputSchema, type SummarizerInput, type SummarizerOutput } from '@/ai/schemas/summarizer';

export async function summarizeText(input: SummarizerInput): Promise<SummarizerOutput> {
  return summarizerFlow(input);
}

const prompt = ai.definePrompt({
    name: 'summarizerPrompt',
    input: { schema: SummarizerInputSchema },
    output: { schema: SummarizerOutputSchema },
    prompt: `You are an expert summarizer. Analyze the following text or the content from the provided URL and create a concise, easy-to-read summary.

    If the input looks like a URL, fetch its content. Otherwise, treat the input as plain text.

    Content to Summarize:
    {{{text}}}

    Provide a summary of the key points.`,
});

const summarizerFlow = ai.defineFlow(
    {
        name: 'summarizerFlow',
        inputSchema: SummarizerInputSchema,
        outputSchema: SummarizerOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
