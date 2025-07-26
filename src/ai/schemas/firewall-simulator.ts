import {z} from 'genkit';

export const FirewallSimulatorInputSchema = z.object({
  rules: z.string().describe('A list of firewall rules, one per line. For example: "ALLOW TCP from any to 192.168.1.100 on port 80"'),
  trafficScenario: z.string().describe('A description of a network traffic packet to test against the rules. For example: "An incoming request from IP 203.0.113.50 to port 80 on our server 192.168.1.100"'),
});
export type FirewallSimulatorInput = z.infer<typeof FirewallSimulatorInputSchema>;

export const FirewallSimulatorOutputSchema = z.object({
  decision: z.enum(['Allowed', 'Denied']).describe('The decision made by the firewall.'),
  reason: z.string().describe('A detailed explanation of why the decision was made, referencing the specific rule that was matched.'),
  rulesExplanation: z.string().describe('A general, high-level explanation of the provided set of rules.'),
});
export type FirewallSimulatorOutput = z.infer<typeof FirewallSimulatorOutputSchema>;
