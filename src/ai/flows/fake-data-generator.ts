
'use server';
/**
 * @fileOverview AI-Powered Fake Data Generator flow.
 */

import { ai } from '@/ai/genkit';
import { FakeDataOutputSchema, type FakeDataOutput } from '@/ai/schemas/fake-data-generator';

export async function generateFakeData(): Promise<FakeDataOutput> {
  return fakeDataGeneratorFlow();
}

const prompt = ai.definePrompt({
    name: 'fakeDataGeneratorPrompt',
    output: { schema: FakeDataOutputSchema },
    prompt: `You are a fake data generator. Create a list of 10 realistic-looking but entirely fake users. Each user should have a full name, a unique email address, and a plausible-sounding street address (including city, state, and zip code).`,
});

const fakeDataGeneratorFlow = ai.defineFlow(
    {
        name: 'fakeDataGeneratorFlow',
        outputSchema: FakeDataOutputSchema,
    },
    async () => {
        const { output } = await prompt();
        return output!;
    }
);
