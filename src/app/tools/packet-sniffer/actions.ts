'use server';

import { packetSnifferSimulator } from '@/ai/flows/packet-sniffer-simulator';
import { type PacketSnifferOutput } from '@/ai/schemas/packet-sniffer-simulator';
import { z } from 'zod';

const schema = z.object({
  scenario: z.string().min(10, "Please describe a scenario.").max(500, "Scenario cannot exceed 500 characters."),
});

export type PacketSnifferState = {
  data: PacketSnifferOutput | null;
  message: string | null;
  fieldErrors?: {
    scenario?: string[];
  };
};

export async function simulateCaptureAction(prevState: PacketSnifferState, formData: FormData): Promise<PacketSnifferState> {
  const validatedFields = schema.safeParse({
    scenario: formData.get('scenario'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await packetSnifferSimulator(validatedFields.data);
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while simulating the capture: ${errorMessage}` };
  }
}
