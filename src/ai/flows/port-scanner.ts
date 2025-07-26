
'use server';
/**
 * @fileOverview AI-Powered Port Scanner Simulator for educational purposes.
 *
 * - portScanner - A function that simulates scanning a target for open ports.
 */

import {ai} from '@/ai/genkit';
import { PortScannerInputSchema, PortScannerOutputSchema, type PortScannerInput, type PortScannerOutput } from '@/ai/schemas/port-scanner';


export async function portScanner(input: PortScannerInput): Promise<PortScannerOutput> {
  return portScannerFlow(input);
}

const prompt = ai.definePrompt({
    name: 'portScannerPrompt',
    input: {schema: PortScannerInputSchema},
    output: {schema: PortScannerOutputSchema},
    prompt: `You are a cybersecurity expert simulating a port scan for educational purposes. **You must not perform a real port scan.**
    
    Based on the target and the requested ports, predict the likely status of each port.
    
    Target: {{{target}}}
    Ports to scan: {{{ports}}}

    Instructions:
    1.  Analyze the target. If it's a common domain (like google.com, amazon.com), infer its likely role (e.g., web server, mail server). If it's an IP, make a reasonable guess.
    2.  For each port in the list, determine its likely status ('Open', 'Closed', 'Filtered', 'Unknown').
    3.  Identify the common service for well-known open ports (e.g., 80 is HTTP, 443 is HTTPS, 22 is SSH).
    4.  Provide a confidence level ('High', 'Medium', 'Low') for your prediction on each port. The confidence should be high for very common ports on specific server types (e.g., 80/443 on a web server) and lower for less common ports or generic targets.
    5.  Generate a summary of what the open ports suggest about the server's function (e.g., "The open ports 80 and 443 strongly suggest this is a web server.").
    6.  **Crucially, frame the entire response as an educational simulation.** Do not claim to have performed a real scan.
    
    Example for target "google.com" and ports "80, 22, 443":
    - Port 80: Open, HTTP, High confidence
    - Port 443: Open, HTTPS, High confidence
    - Port 22: Filtered, SSH, Medium confidence (Large companies often filter SSH from public internet)
    Summary: "The open ports 80 and 443 are characteristic of a web server..."
    `,
});

const portScannerFlow = ai.defineFlow(
    {
        name: 'portScannerFlow',
        inputSchema: PortScannerInputSchema,
        outputSchema: PortScannerOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
