'use server';

import { generatePhishingEmail, PhishingEmailGeneratorOutput } from '@/ai/flows/phishing-email-generator';
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";

const schema = z.object({
  targetName: z.string().min(2, "Target name must be at least 2 characters.").max(50),
  companyName: z.string().min(2, "Company name must be at least 2 characters.").max(50),
  scenario: z.string().min(5, "Scenario must be at least 5 characters.").max(100),
});

export type PhishingSimulatorState = {
  data: PhishingEmailGeneratorOutput | null;
  message: string | null;
  fieldErrors?: {
    targetName?: string[];
    companyName?: string[];
    scenario?: string[];
  };
};

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

export async function generateEmailAction(prevState: PhishingSimulatorState, formData: FormData): Promise<PhishingSimulatorState> {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const { success: limitReached } = await ratelimit.limit(ip);

  if (!limitReached) {
      return { data: null, message: "Rate limit exceeded. Please try again in a minute." };
  }
    
  const validatedFields = schema.safeParse({
    targetName: formData.get('targetName'),
    companyName: formData.get('companyName'),
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
    const result = await generatePhishingEmail(validatedFields.data);
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while generating the email: ${errorMessage}` };
  }
}
