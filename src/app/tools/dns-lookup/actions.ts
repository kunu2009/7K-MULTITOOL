'use server';

import { dnsLookup, DnsLookupOutput } from '@/ai/flows/dns-lookup';
import { z } from 'zod';

const schema = z.object({
  domain: z.string().min(3, "Domain must be at least 3 characters.").refine(val => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
    message: "Invalid domain format.",
  }),
});

export type DnsState = {
  data: DnsLookupOutput | null;
  message: string | null;
  fieldErrors?: {
    domain?: string[];
  };
};

export async function getDnsRecordsAction(prevState: DnsState, formData: FormData): Promise<DnsState> {
  const validatedFields = schema.safeParse({
    domain: formData.get('domain'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await dnsLookup({ domain: validatedFields.data.domain });
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while fetching DNS records: ${errorMessage}` };
  }
}
