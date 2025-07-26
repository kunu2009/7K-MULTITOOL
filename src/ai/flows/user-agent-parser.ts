// src/ai/flows/user-agent-parser.ts
'use server';
/**
 * @fileOverview AI-Powered User-Agent Parser flow.
 * 
 * - parseUserAgent - A function that accepts a User-Agent string and returns a parsed object.
 * - UserAgentParserInput - The input type for the parseUserAgent function.
 * - UserAgentParserOutput - The return type for the parseUserAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserAgentParserInputSchema = z.object({
  userAgent: z.string().describe('The User-Agent string to be parsed.'),
});
export type UserAgentParserInput = z.infer<typeof UserAgentParserInputSchema>;

const UserAgentParserOutputSchema = z.object({
  browser: z.object({
    name: z.string().describe('The name of the browser.'),
    version: z.string().describe('The version of the browser.'),
    engine: z.string().describe('The rendering engine of the browser.'),
  }),
  os: z.object({
    name: z.string().describe('The name of the operating system.'),
    version: z.string().describe('The version of the operating system.'),
  }),
  device: z.object({
    type: z.string().describe('The type of the device (e.g., mobile, desktop, tablet).'),
    vendor: z.string().describe('The vendor of the device.'),
    model: z.string().describe('The model of the device.'),
  }),
  isBot: z.boolean().describe('Whether the User-Agent belongs to a bot or crawler.'),
});
export type UserAgentParserOutput = z.infer<typeof UserAgentParserOutputSchema>;

export async function parseUserAgent(input: UserAgentParserInput): Promise<UserAgentParserOutput> {
  return userAgentParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'userAgentParserPrompt',
  input: {schema: UserAgentParserInputSchema},
  output: {schema: UserAgentParserOutputSchema},
  prompt: `You are an expert at parsing User-Agent strings. Analyze the following User-Agent string and extract the browser, OS, and device information. Determine if it's a bot.

User-Agent: {{{userAgent}}}`,
});

const userAgentParserFlow = ai.defineFlow(
  {
    name: 'userAgentParserFlow',
    inputSchema: UserAgentParserInputSchema,
    outputSchema: UserAgentParserOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
