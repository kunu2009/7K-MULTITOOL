'use server';

import { firewallSimulator } from '@/ai/flows/firewall-simulator';
import { type FirewallSimulatorOutput } from '@/ai/schemas/firewall-simulator';
import { z } from 'zod';

const schema = z.object({
  rules: z.string().min(10, "Please define at least one rule.").max(2000, "Rules cannot exceed 2000 characters."),
  trafficScenario: z.string().min(10, "Please describe a traffic scenario.").max(500, "Scenario cannot exceed 500 characters."),
});

export type FirewallSimulatorState = {
  data: FirewallSimulatorOutput | null;
  message: string | null;
  fieldErrors?: {
    rules?: string[];
    trafficScenario?: string[];
  };
};

export async function simulateFirewallAction(prevState: FirewallSimulatorState, formData: FormData): Promise<FirewallSimulatorState> {
  const validatedFields = schema.safeParse({
    rules: formData.get('rules'),
    trafficScenario: formData.get('trafficScenario'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await firewallSimulator(validatedFields.data);
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while simulating the firewall: ${errorMessage}` };
  }
}
