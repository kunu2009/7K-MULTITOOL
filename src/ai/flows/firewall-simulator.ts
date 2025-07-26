'use server';
/**
 * @fileOverview AI-Powered Firewall Simulator for educational purposes.
 *
 * - firewallSimulator - A function that simulates a firewall's decision based on a set of rules and a traffic scenario.
 */

import {ai} from '@/ai/genkit';
import { FirewallSimulatorInputSchema, FirewallSimulatorOutputSchema, type FirewallSimulatorInput, type FirewallSimulatorOutput } from '@/ai/schemas/firewall-simulator';


export async function firewallSimulator(input: FirewallSimulatorInput): Promise<FirewallSimulatorOutput> {
  return firewallSimulatorFlow(input);
}

const prompt = ai.definePrompt({
    name: 'firewallSimulatorPrompt',
    input: {schema: FirewallSimulatorInputSchema},
    output: {schema: FirewallSimulatorOutputSchema},
    prompt: `You are a network security expert simulating a firewall for educational purposes. Analyze the provided rules and traffic scenario.

    Firewall Rules (one per line, evaluated top-down):
    {{{rules}}}

    Traffic Scenario:
    {{{trafficScenario}}}

    Instructions:
    1.  First, provide a brief, high-level explanation of what the defined firewall rules are trying to achieve.
    2.  Evaluate the traffic scenario against the rules in the order they are provided.
    3.  The first rule that matches the traffic determines the outcome. If no rule matches, the default action is typically to deny.
    4.  Determine if the traffic should be 'Allowed' or 'Denied'.
    5.  Provide a clear and concise reason for your decision, explicitly stating which rule was matched (or that no rule was matched).
    6.  **This is a simulation.** Do not perform any real network actions.
    `,
});

const firewallSimulatorFlow = ai.defineFlow(
    {
        name: 'firewallSimulatorFlow',
        inputSchema: FirewallSimulatorInputSchema,
        outputSchema: FirewallSimulatorOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
