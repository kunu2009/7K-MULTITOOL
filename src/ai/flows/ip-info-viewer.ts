'use server';
/**
 * @fileOverview AI-Powered IP Address Information Viewer.
 *
 * - viewIpInfo - A function that accepts an IP address and returns detailed information about it.
 * - IpInfoViewerInput - The input type for the function.
 * - IpInfoViewerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IpInfoViewerInputSchema = z.object({
  ipAddress: z.string().ip({ message: "Invalid IP address format." }).describe('The IP address to get information for.'),
});
export type IpInfoViewerInput = z.infer<typeof IpInfoViewerInputSchema>;

const IpInfoViewerOutputSchema = z.object({
  ipAddress: z.string().describe('The IP address that was analyzed.'),
  location: z.object({
    city: z.string().describe('The city where the IP address is located.'),
    region: z.string().describe('The state or region.'),
    country: z.string().describe('The country.'),
    zipCode: z.string().describe('The postal code.'),
    latitude: z.number().describe('The approximate latitude.'),
    longitude: z.number().describe('The approximate longitude.'),
  }),
  isp: z.string().describe('The Internet Service Provider (ISP) associated with the IP.'),
  organization: z.string().describe('The organization that owns the IP address block.'),
  isProxyOrVpn: z.boolean().describe('Whether the IP is likely a proxy or VPN.'),
  threatAssessment: z.string().describe("A brief assessment of any potential security threats or characteristics of the IP (e.g., 'Known Tor exit node', 'Public proxy', 'Residential IP')."),
});
export type IpInfoViewerOutput = z.infer<typeof IpInfoViewerOutputSchema>;

export async function viewIpInfo(input: IpInfoViewerInput): Promise<IpInfoViewerOutput> {
    return ipInfoViewerFlow(input);
}

const prompt = ai.definePrompt({
    name: 'ipInfoViewerPrompt',
    input: {schema: IpInfoViewerInputSchema},
    output: {schema: IpInfoViewerOutputSchema},
    prompt: `You are a network security expert with access to geolocation and IP intelligence data. Analyze the following IP address and provide detailed information about it.

    IP Address: {{{ipAddress}}}
    
    Based on the IP address, provide the location details (city, region, country, zip, lat/lon), the ISP, and the owning organization.
    
    Also, assess whether the IP is associated with a known proxy, VPN, or Tor node.
    
    Finally, provide a brief threat assessment or general characterization of the IP.`,
});

const ipInfoViewerFlow = ai.defineFlow(
    {
        name: 'ipInfoViewerFlow',
        inputSchema: IpInfoViewerInputSchema,
        outputSchema: IpInfoViewerOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
