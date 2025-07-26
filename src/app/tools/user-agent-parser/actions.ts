'use server';

import { parseUserAgent, UserAgentParserOutput } from '@/ai/flows/user-agent-parser';
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";

const schema = z.object({
  userAgent: z.string().min(5, { message: 'User-Agent must be at least 5 characters long.' }).max(500, { message: 'User-Agent cannot exceed 500 characters.' }),
});

export type ParserState = {
  data: UserAgentParserOutput | null;
  message: string | null;
  fieldErrors?: {
    userAgent?: string[];
  };
};

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

export async function parseUserAgentAction(prevState: ParserState, formData: FormData): Promise<ParserState> {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const { success: limitReached } = await ratelimit.limit(ip);

  if (!limitReached) {
      return { data: null, message: "Rate limit exceeded. Please try again in a minute." };
  }
    
  const validatedFields = schema.safeParse({
    userAgent: formData.get('userAgent'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await parseUserAgent({ userAgent: validatedFields.data.userAgent });
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while parsing the User-Agent: ${errorMessage}` };
  }
}
