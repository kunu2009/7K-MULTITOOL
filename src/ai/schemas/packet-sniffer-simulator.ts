import {z} from 'genkit';

export const PacketSnifferInputSchema = z.object({
  scenario: z.string().describe('A description of the network activity to simulate. e.g., "A user logging into a secure website."'),
});
export type PacketSnifferInput = z.infer<typeof PacketSnifferInputSchema>;

const PacketSchema = z.object({
  timestamp: z.string().describe('A simulated timestamp for the packet capture (e.g., "0.001234").'),
  sourceIp: z.string().ip().describe('The source IP address.'),
  destinationIp: z.string().ip().describe('The destination IP address.'),
  protocol: z.enum(['TCP', 'UDP', 'ICMP', 'DNS', 'HTTP', 'HTTPS', 'TLSv1.2', 'TLSv1.3']).describe('The network protocol.'),
  sourcePort: z.number().optional().describe('The source port number.'),
  destinationPort: z.number().optional().describe('The destination port number.'),
  summary: z.string().describe("A brief, high-level summary of the packet's content or purpose."),
});

export const PacketSnifferOutputSchema = z.object({
  summary: z.string().describe('A high-level overview of the entire captured network flow.'),
  packets: z.array(PacketSchema).describe('A list of the simulated packets that were "captured".'),
});
export type PacketSnifferOutput = z.infer<typeof PacketSnifferOutputSchema>;
