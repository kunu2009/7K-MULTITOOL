'use server';
/**
 * @fileOverview AI-Powered Phishing Email Generator for educational purposes.
 *
 * - generatePhishingEmail - A function that creates a simulated phishing email and identifies its red flags.
 * - PhishingEmailGeneratorInput - The input type for the function.
 * - PhishingEmailGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PhishingEmailGeneratorInputSchema = z.object({
  targetName: z.string().describe('The name of the person the email is supposedly addressed to.'),
  companyName: z.string().describe('The name of the company the email is pretending to be from.'),
  scenario: z.string().describe('The scenario for the phishing attempt (e.g., "Password Reset," "Unusual Login," "Invoice Due").'),
});
export type PhishingEmailGeneratorInput = z.infer<typeof PhishingEmailGeneratorInputSchema>;

const PhishingEmailGeneratorOutputSchema = z.object({
    emailSubject: z.string().describe('The subject line of the generated phishing email.'),
    emailBody: z.string().describe('The HTML body of the generated phishing email. This should look like a real email.'),
    redFlags: z.array(z.string()).describe('A list of explanations identifying the red flags in the email that suggest it is a phishing attempt.'),
});
export type PhishingEmailGeneratorOutput = z.infer<typeof PhishingEmailGeneratorOutputSchema>;

export async function generatePhishingEmail(input: PhishingEmailGeneratorInput): Promise<PhishingEmailGeneratorOutput> {
    return phishingEmailGeneratorFlow(input);
}

const prompt = ai.definePrompt({
    name: 'phishingEmailGeneratorPrompt',
    input: {schema: PhishingEmailGeneratorInputSchema},
    output: {schema: PhishingEmailGeneratorOutputSchema},
    prompt: `You are a cybersecurity expert creating educational materials. Your task is to generate a realistic-looking phishing email based on a given scenario. The email should be convincing but contain subtle red flags. You must also identify and explain these red flags.

    Scenario: {{{scenario}}}
    Target's Name: {{{targetName}}}
    Impersonated Company: {{{companyName}}}

    Instructions:
    1.  Create a compelling subject line for the email.
    2.  Write the HTML body of the email. It should look professional. Use common phishing tactics like a sense of urgency, a generic greeting, and a suspicious link (use '#' for the href).
    3.  Create a list of red flags that would help someone identify this as a phishing email. Be specific and explain why each is a red flag. Examples: urgent language, generic greeting, mismatched sender address (which you can imply), suspicious links, etc.
    `,
});

const phishingEmailGeneratorFlow = ai.defineFlow(
    {
        name: 'phishingEmailGeneratorFlow',
        inputSchema: PhishingEmailGeneratorInputSchema,
        outputSchema: PhishingEmailGeneratorOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
