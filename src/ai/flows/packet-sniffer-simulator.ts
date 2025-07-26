'use server';
/**
 * @fileOverview AI-Powered Packet Sniffer Simulator for educational purposes.
 *
 * - packetSnifferSimulator - A function that simulates a packet capture based on a user-defined scenario.
 */

import {ai} from '@/ai/genkit';
import { PacketSnifferInputSchema, PacketSnifferOutputSchema, type PacketSnifferInput, type PacketSnifferOutput } from '@/ai/schemas/packet-sniffer-simulator';


export async function packetSnifferSimulator(input: PacketSnifferInput): Promise<PacketSnifferOutput> {
  return packetSnifferSimulatorFlow(input);
}

const prompt = ai.definePrompt({
    name: 'packetSnifferSimulatorPrompt',
    input: {schema: PacketSnifferInputSchema},
    output: {schema: PacketSnifferOutputSchema},
    prompt: `You are a cybersecurity expert simulating a network packet capture for educational purposes. **You must not perform a real network capture.**
    
    Based on the user's described scenario, generate a realistic sequence of network packets.

    Scenario: {{{scenario}}}

    Instructions:
    1.  Invent realistic IP addresses for the client and server(s) involved. Use private IPs (like 192.168.x.x) for clients and public IPs for servers.
    2.  Create a logical sequence of packets representing the described flow. For example, a web request would involve a DNS query, TCP handshake (SYN, SYN-ACK, ACK), HTTP/HTTPS request, and data transfer.
    3.  Generate between 5 and 15 packets to represent the interaction.
    4.  For each packet, provide a timestamp, source/destination IPs and ports, the protocol, and a clear summary of what the packet is doing (e.g., "Client initiates TCP handshake with server", "Client sends GET request for /index.html").
    5.  Provide a high-level summary of the entire captured flow.
    6.  **Crucially, frame the entire response as an educational simulation.** Do not claim to have performed a real capture.
    `,
});

const packetSnifferSimulatorFlow = ai.defineFlow(
    {
        name: 'packetSnifferSimulatorFlow',
        inputSchema: PacketSnifferInputSchema,
        outputSchema: PacketSnifferOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
