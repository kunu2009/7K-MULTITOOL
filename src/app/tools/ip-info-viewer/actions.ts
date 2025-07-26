'use server';

import { viewIpInfo, IpInfoViewerOutput } from '@/ai/flows/ip-info-viewer';
import { z } from 'zod';
import { headers } from "next/headers";

const schema = z.object({
  ipAddress: z.string().ip({ message: "Invalid IP address provided." }),
});

export type IpInfoState = {
  data: IpInfoViewerOutput | null;
  message: string | null;
  fieldErrors?: {
    ipAddress?: string[];
  };
};

export async function getIpInfoAction(prevState: IpInfoState, formData: FormData): Promise<IpInfoState> {
  const forwardedFor = headers().get("x-forwarded-for");
  const ip = formData.get('ipAddress') as string || forwardedFor || "127.0.0.1";
  
  const validatedFields = schema.safeParse({
    ipAddress: ip,
  });

  if (!validatedFields.success) {
    return {
      data: null,
      message: 'Invalid input.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await viewIpInfo({ ipAddress: validatedFields.data.ipAddress });
    return { data: result, message: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, message: `An error occurred while fetching IP information: ${errorMessage}` };
  }
}
