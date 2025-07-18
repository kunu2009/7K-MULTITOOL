// src/ai/flows/code-explainer.ts
'use server';
/**
 * @fileOverview AI-Powered Code Explainer flow.
 *
 * - codeExplainer - A function that accepts a code snippet and returns an explanation, security implications, and suggestions for improvement.
 * - CodeExplainerInput - The input type for the codeExplainer function.
 * - CodeExplainerOutput - The return type for the codeExplainer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeExplainerInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet to be explained.'),
});
export type CodeExplainerInput = z.infer<typeof CodeExplainerInputSchema>;

const CodeExplainerOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the code snippet.'),
  securityImplications: z
    .string()
    .describe('Potential security implications of the code.'),
  suggestions: z.string().describe('Suggestions for improving the code.'),
});
export type CodeExplainerOutput = z.infer<typeof CodeExplainerOutputSchema>;

export async function codeExplainer(input: CodeExplainerInput): Promise<CodeExplainerOutput> {
  return codeExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeExplainerPrompt',
  input: {schema: CodeExplainerInputSchema},
  output: {schema: CodeExplainerOutputSchema},
  prompt: `You are an AI expert in explaining code, identifying security vulnerabilities, and suggesting improvements.

  Analyze the following code snippet and provide:

  1.  A detailed explanation of the code's functionality.
  2.  Potential security implications of the code.
  3.  Suggestions for improving the code.

  Code Snippet:
  ```
  {{{codeSnippet}}}
  ````,
});

const codeExplainerFlow = ai.defineFlow(
  {
    name: 'codeExplainerFlow',
    inputSchema: CodeExplainerInputSchema,
    outputSchema: CodeExplainerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
