'use server';

import { portScanner, PortScannerOutput } from '@/ai/flows/port-scanner';
import { z } from 'zod';

const schema = z.object({
  target: z.string().min(3, "Target must be at least 3 characters."),
  ports: z.string().min(1, "Please enter at least one port.").refine(val => {
    // Regex to validate comma-separated ports and port ranges (e.g., 80,443,8080-8090)
    return /^(?:\d+(?:-\d+)?(?:,|$))+$/.test(val.replace(/\s/g, ''));
  }, {
    message: "Invalid port format. Use comma-separated numbers or ranges (e.g., 80, 443, 8080-8090).",
  }),
});

export type PortScannerState = {
  data: PortScannerOutput | null;
  message: string | null;
  fieldErrors?: {
    target?: string[];
    ports?: string[];
  };
};

export async function scanPortsAction(prevState: PortScannerState, formData: FormData): Promise<PortScannerState> {
  const validatedFields = schema.safeParse({
    target: formData.get('target'),
    ports: formData.get('ports'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await portScanner(validatedFields.data);
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while simulating the port scan: ${errorMessage}` };
  }
}
