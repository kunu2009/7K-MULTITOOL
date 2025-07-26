'use server';
/**
 * @fileOverview AI-Powered WHOIS Lookup Tool.
 *
 * - whoisLookup - A function that accepts a domain and returns its WHOIS records.
 * - WhoisLookupInput - The input type for the function.
 * - WhoisLookupOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WhoisLookupInputSchema = z.object({
  domain: z.string().describe('The domain name to look up.'),
});
export type WhoisLookupInput = z.infer<typeof WhoisLookupInputSchema>;

const WhoisLookupOutputSchema = z.object({
  domainName: z.string().describe('The domain name that was queried.'),
  registrar: z.string().describe('The registrar of the domain.'),
  registrationDate: z.string().describe('The date the domain was registered.'),
  expirationDate: z.string().describe('The date the domain will expire.'),
  updatedDate: z.string().describe('The date the domain was last updated.'),
  status: z.array(z.string()).describe('The status of the domain (e.g., clientTransferProhibited).'),
  nameServers: z.array(z.string()).describe('The name servers for the domain.'),
  rawText: z.string().describe('The raw WHOIS data as a single block of text.'),
});
export type WhoisLookupOutput = z.infer<typeof WhoisLookupOutputSchema>;

export async function whoisLookup(input: WhoisLookupInput): Promise<WhoisLookupOutput> {
  return whoisLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whoisLookupPrompt',
  input: {schema: WhoisLookupInputSchema},
  output: {schema: WhoisLookupOutputSchema},
  prompt: `You are a WHOIS lookup expert. Perform a WHOIS lookup for the domain "{{domain}}" and extract the key information: Domain Name, Registrar, Registration Date, Expiration Date, Updated Date, Status, and Name Servers. Also, provide the raw WHOIS text output. Note that contact information is often redacted and should not be expected.`,
});

const whoisLookupFlow = ai.defineFlow(
  {
    name: 'whoisLookupFlow',
    inputSchema: WhoisLookupInputSchema,
    outputSchema: WhoisLookupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
