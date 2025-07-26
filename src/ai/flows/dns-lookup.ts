'use server';
/**
 * @fileOverview AI-Powered DNS Lookup Tool.
 *
 * - dnsLookup - A function that accepts a domain and returns its DNS records.
 * - DnsLookupInput - The input type for the function.
 * - DnsLookupOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DnsLookupInputSchema = z.object({
  domain: z.string().describe('The domain name to look up.'),
});
export type DnsLookupInput = z.infer<typeof DnsLookupInputSchema>;

const RecordSchema = z.object({
  type: z.string(),
  value: z.string(),
  ttl: z.string().optional(),
});

const DnsLookupOutputSchema = z.object({
  a: z.array(RecordSchema).describe('A records (IPv4 addresses)'),
  aaaa: z.array(RecordSchema).describe('AAAA records (IPv6 addresses)'),
  cname: z.array(RecordSchema).describe('CNAME records (Canonical Name)'),
  mx: z.array(RecordSchema).describe('MX records (Mail Exchange)'),
  ns: z.array(RecordSchema).describe('NS records (Name Server)'),
  txt: z.array(RecordSchema).describe('TXT records (Text)'),
  soa: z.array(RecordSchema).describe('SOA records (Start of Authority)'),
});
export type DnsLookupOutput = z.infer<typeof DnsLookupOutputSchema>;

export async function dnsLookup(input: DnsLookupInput): Promise<DnsLookupOutput> {
  return dnsLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dnsLookupPrompt',
  input: {schema: DnsLookupInputSchema},
  output: {schema: DnsLookupOutputSchema},
  prompt: `You are a DNS lookup expert. Perform a DNS lookup for the domain "{{domain}}" and return all common record types (A, AAAA, CNAME, MX, NS, TXT, SOA). Provide the value and TTL for each record.`,
});

const dnsLookupFlow = ai.defineFlow(
  {
    name: 'dnsLookupFlow',
    inputSchema: DnsLookupInputSchema,
    outputSchema: DnsLookupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
