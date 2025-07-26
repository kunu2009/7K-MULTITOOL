import { config } from 'dotenv';
config();

import '@/ai/flows/code-explainer.ts';
import '@/ai/flows/user-agent-parser.ts';
import '@/ai/flows/phishing-email-generator.ts';
import '@/ai/flows/ip-info-viewer.ts';
import '@/ai/flows/dns-lookup.ts';
import '@/ai/flows/whois-lookup.ts';
import '@/ai/flows/port-scanner.ts';
import '@/ai/flows/lorem-ipsum-generator.ts';
import '@/ai/flows/vulnerability-scanner.ts';
