'use server';

import { codeExplainer, CodeExplainerOutput } from '@/ai/flows/code-explainer';
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";

const schema = z.object({
  code: z.string().min(10, { message: 'Code snippet must be at least 10 characters long.' }).max(5000, { message: 'Code snippet cannot exceed 5000 characters.' }),
});

export type ExplanationState = {
  data: CodeExplainerOutput | null;
  message: string | null;
  fieldErrors?: {
    code?: string[];
  };
};

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

export async function explainCode(prevState: ExplanationState, formData: FormData): Promise<ExplanationState> {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const { success: limitReached } = await ratelimit.limit(ip);

  if (!limitReached) {
      return { data: null, message: "Rate limit exceeded. Please try again in a minute." };
  }
    
  const validatedFields = schema.safeParse({
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await codeExplainer({ codeSnippet: validatedFields.data.code });
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while explaining the code: ${errorMessage}` };
  }
}
