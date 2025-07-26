'use server';
/**
 * @fileOverview AI-Powered SSL/TLS Checker Simulator for educational purposes.
 *
 * - checkSslTls - A function that simulates checking the SSL/TLS certificate for a domain.
 */

import {ai} from '@/ai/genkit';
import { SslTlsCheckerInputSchema, SslTlsCheckerOutputSchema, type SslTlsCheckerInput, type SslTlsCheckerOutput } from '@/ai/schemas/ssl-tls-checker';


export async function checkSslTls(input: SslTlsCheckerInput): Promise<SslTlsCheckerOutput> {
  return sslTlsCheckerFlow(input);
}

const prompt = ai.definePrompt({
    name: 'sslTlsCheckerPrompt',
    input: {schema: SslTlsCheckerInputSchema},
    output: {schema: SslTlsCheckerOutputSchema},
    prompt: `You are a cybersecurity expert simulating an SSL/TLS certificate check for educational purposes. **You must not perform a real network connection.**
    
    Based on the target domain, predict the likely details of its SSL/TLS certificate.
    
    Target: {{{domain}}}

    Instructions:
    1.  Analyze the target domain. For common domains (google.com, github.com, etc.), use your knowledge to provide realistic data. For less common domains, generate plausible data for a standard certificate (e.g., issued by Let's Encrypt or another major CA).
    2.  Fill out all fields in the output schema, including the certificate subject, issuer, validity period, SANs, and signature algorithm.
    3.  Calculate the days remaining based on a reasonable expiration date. Assume today's date is {{currentDate}}.
    4.  Simulate a certificate chain, typically including one intermediate CA.
    5.  Determine an overall status (e.g., 'Valid' for a standard check, or invent a 'Warning' if you want to create an educational scenario like a nearly-expired certificate).
    6.  Provide a concise summary message explaining the overall status.
    7.  **Crucially, frame the entire response as an educational simulation.** Do not claim to have performed a real check.
    `,
});

const sslTlsCheckerFlow = ai.defineFlow(
    {
        name: 'sslTlsCheckerFlow',
        inputSchema: SslTlsCheckerInputSchema,
        outputSchema: SslTlsCheckerOutputSchema,
    },
    async (input) => {
        const {output} = await prompt({...input, currentDate: new Date().toDateString() });
        return output!;
    }
);
