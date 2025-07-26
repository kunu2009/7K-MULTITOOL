import {z} from 'genkit';

export const SslTlsCheckerInputSchema = z.object({
  domain: z.string().min(3, "Domain must be at least 3 characters.").refine(val => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
    message: "Invalid domain format.",
  }),
});
export type SslTlsCheckerInput = z.infer<typeof SslTlsCheckerInputSchema>;

const CertificateDetailsSchema = z.object({
    subject: z.object({
        commonName: z.string().describe("The primary domain name covered by the certificate."),
        organization: z.string().describe("The organization the certificate was issued to."),
    }),
    issuer: z.object({
        commonName: z.string().describe("The name of the Certificate Authority (CA) that issued the certificate."),
        organization: z.string().describe("The organization of the issuing CA."),
    }),
    validity: z.object({
        issued: z.string().describe("The date the certificate was issued."),
        expires: z.string().describe("The date the certificate will expire."),
        daysRemaining: z.number().describe("The number of days until the certificate expires."),
    }),
    subjectAltNames: z.array(z.string()).describe("A list of all other domain names (Subject Alternative Names) covered by the certificate."),
    signatureAlgorithm: z.string().describe("The algorithm used to sign the certificate."),
});

const CheckResultSchema = z.object({
    status: z.enum(['Valid', 'Expired', 'Warning', 'Error']).describe("The overall status of the certificate."),
    message: z.string().describe("A summary message explaining the status."),
});

export const SslTlsCheckerOutputSchema = z.object({
  certificate: CertificateDetailsSchema.describe("The detailed information about the SSL/TLS certificate."),
  chain: z.array(CertificateDetailsSchema.optional()).describe("The certificate chain, from the leaf to the root CA."),
  overallResult: CheckResultSchema.describe("The final result of the SSL/TLS check."),
});
export type SslTlsCheckerOutput = z.infer<typeof SslTlsCheckerOutputSchema>;
