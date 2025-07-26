import {z} from 'genkit';

export const PortScannerInputSchema = z.object({
  target: z.string().describe('The domain name or IP address to scan.'),
  ports: z
    .string()
    .describe(
      'A comma-separated list or range of ports to scan (e.g., "80,443,8080-8090").'
    ),
});
export type PortScannerInput = z.infer<typeof PortScannerInputSchema>;

const PortStatusSchema = z.object({
  port: z.number().describe('The port number.'),
  status: z
    .enum(['Open', 'Closed', 'Filtered', 'Unknown'])
    .describe('The status of the port.'),
  service: z
    .string()
    .optional()
    .describe('The common service running on this port (e.g., HTTP, FTP, SMTP).'),
  confidence: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The confidence level of the prediction.'),
});

export const PortScannerOutputSchema = z.object({
  results: z.array(PortStatusSchema).describe('The results of the port scan.'),
  summary: z
    .string()
    .describe(
      'A brief summary of the findings, including the most likely role of the server based on open ports.'
    ),
});
export type PortScannerOutput = z.infer<typeof PortScannerOutputSchema>;
