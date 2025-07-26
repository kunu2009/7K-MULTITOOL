import {
  ShieldCheck,
  Code,
  Wrench,
  FlaskConical,
  KeyRound,
  Hash,
  Binary,
  BookType,
  Link,
  Fingerprint,
  MailWarning,
  Network,
  Dna,
  BookUser,
  ScanLine,
  ShieldAlert,
  ServerCog,
  ShieldQuestion,
  GraduationCap,
  FileJson,
  Regex,
  MessageSquare,
  QrCode,
  FingerprintIcon,
  CodeXml,
  Clapperboard,
  Palette,
  Cloud,
  ListOrdered,
  GitFork,
  Shuffle,
  Replace,
  Calculator,
  ScanText,
  Timer,
  BookText,
  LockKeyhole,
  Scale,
  Percent,
  ClipboardList,
  CircleDollarSign,
  Briefcase,
  Eye,
  Key,
  Database,
  Bot,
} from 'lucide-react';

export type Tool = {
  name: string;
  slug: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'security' | 'developer' | 'general' | 'advanced';
  implemented: boolean;
};

export type ToolCategory = {
  name: string;
  id: 'security' | 'developer' | 'general' | 'advanced';
  tools: Tool[];
};

export const toolsConfig: ToolCategory[] = [
  {
    name: 'Security & Hacking',
    id: 'security',
    tools: [
      { name: 'Password Strength Checker', slug: 'password-strength-checker', description: 'Evaluate password strength.', icon: KeyRound, category: 'security', implemented: true },
      { name: 'Hash Generator', slug: 'hash-generator', description: 'Generate MD5, SHA1, SHA256 hashes.', icon: Hash, category: 'security', implemented: true },
      { name: 'Base64 Encoder/Decoder', slug: 'base64-encoder-decoder', description: 'Encode/decode Base64 strings.', icon: Binary, category: 'security', implemented: true },
      { name: 'URL Encoder/Decoder', slug: 'url-encoder-decoder', description: 'Encode/decode URL components.', icon: Link, category: 'security', implemented: true },
      { name: 'User-Agent Parser', slug: 'user-agent-parser', description: 'Parse User-Agent strings.', icon: Fingerprint, category: 'security', implemented: true },
      { name: 'Phishing Simulator', slug: 'phishing-simulator', description: 'Educational phishing simulation.', icon: MailWarning, category: 'security', implemented: true },
      { name: 'IP Info Viewer', slug: 'ip-info-viewer', description: 'View information about an IP address.', icon: Network, category: 'security', implemented: true },
      { name: 'DNS Lookup', slug: 'dns-lookup', description: 'Perform DNS lookups.', icon: Dna, category: 'security', implemented: true },
      { name: 'WHOIS Lookup', slug: 'whois-lookup', description: 'Perform WHOIS lookups.', icon: BookUser, category: 'security', implemented: true },
      { name: 'Port Scanner', slug: 'port-scanner', description: 'Scan for open ports (educational).', icon: ScanLine, category: 'security', implemented: true },
      { name: 'Vulnerability Scanner', slug: 'vulnerability-scanner', description: 'Scan for web vulnerabilities.', icon: ShieldAlert, category: 'security', implemented: true },
      { name: 'Firewall Simulator', slug: 'firewall-simulator', description: 'Simulate firewall configurations.', icon: ServerCog, category: 'security', implemented: true },
      { name: 'SSL/TLS Checker', slug: 'ssl-tls-checker', description: 'Check SSL/TLS certificate details.', icon: ShieldCheck, category: 'security', implemented: true },
      { name: 'Packet Sniffer', slug: 'packet-sniffer', description: 'Capture and analyze network packets.', icon: ShieldQuestion, category: 'security', implemented: true },
      { name: 'AI Code Explainer', slug: 'ai-code-explainer', description: 'Explain code and find vulnerabilities.', icon: Bot, category: 'security', implemented: true },
    ],
  },
  {
    name: 'Developer Tools',
    id: 'developer',
    tools: [
      { name: 'JSON Formatter', slug: 'json-formatter', description: 'Beautify or minify JSON data.', icon: FileJson, category: 'developer', implemented: true },
      { name: 'Regex Tester', slug: 'regex-tester', description: 'Test regular expressions.', icon: Regex, category: 'developer', implemented: true },
      { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', description: 'Generate placeholder text.', icon: MessageSquare, category: 'developer', implemented: true },
      { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Generate QR codes.', icon: QrCode, category: 'developer', implemented: false },
      { name: 'UUID Generator', slug: 'uuid-generator', description: 'Generate UUIDs.', icon: FingerprintIcon, category: 'developer', implemented: false },
      { name: 'HTML Entities', slug: 'html-entities', description: 'Encode/decode HTML entities.', icon: CodeXml, category: 'developer', implemented: false },
      { name: 'JWT Decoder', slug: 'jwt-decoder', description: 'Decode JSON Web Tokens.', icon: Clapperboard, category: 'developer', implemented: false },
      { name: 'Color Picker', slug: 'color-picker', description: 'Pick colors and create palettes.', icon: Palette, category: 'developer', implemented: false },
      { name: 'REST API Tester', slug: 'api-tester', description: 'Send HTTP requests to APIs.', icon: Cloud, category: 'developer', implemented: false },
      { name: 'Code Snippet Manager', slug: 'snippet-manager', description: 'Save and manage code snippets.', icon: ListOrdered, category: 'developer', implemented: false },
      { name: 'Git Cheat Sheet', slug: 'git-cheat-sheet', description: 'Quick reference for Git commands.', icon: GitFork, category: 'developer', implemented: false },
      { name: 'Data Format Converter', slug: 'data-converter', description: 'Convert between CSV, JSON, XML, etc.', icon: Shuffle, category: 'developer', implemented: false },
    ],
  },
  {
    name: 'General Utility',
    id: 'general',
    tools: [
      { name: 'Number to Words', slug: 'number-to-words', description: 'Convert numbers to words.', icon: Replace, category: 'general', implemented: true },
      { name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate age from date of birth.', icon: Calculator, category: 'general', implemented: true },
      { name: 'Word/Character Counter', slug: 'word-counter', description: 'Count words and characters in text.', icon: ScanText, category: 'general', implemented: true },
      { name: 'Stopwatch & Timer', slug: 'stopwatch', description: 'Online stopwatch and countdown timer.', icon: Timer, category: 'general', implemented: false },
      { name: 'Text Cleaner', slug: 'text-cleaner', description: 'Remove extra spaces and newlines.', icon: BookText, category: 'general', implemented: false },
      { name: 'Secure Notes', slug: 'secure-notes', description: 'Client-side encrypted notes.', icon: LockKeyhole, category: 'general', implemented: false },
      { name: 'Unit Converter', slug: 'unit-converter', description: 'Convert between various units.', icon: Scale, category: 'general', implemented: false },
      { name: 'GPA Calculator', slug: 'gpa-calculator', description: 'Calculate Grade Point Average.', icon: Percent, category: 'general', implemented: false },
      { name: 'Project Management', slug: 'project-management', description: 'Simple project management tool.', icon: ClipboardList, category: 'general', implemented: false },
      { name: 'Currency Converter', slug: 'currency-converter', description: 'Convert between currencies.', icon: CircleDollarSign, category: 'general', implemented: false },
      { name: 'Scientific Calculator', slug: 'scientific-calculator', description: 'Advanced scientific calculator.', icon: FlaskConical, category: 'general', implemented: false },
    ],
  },
  {
    name: 'Advanced Tools',
    id: 'advanced',
    tools: [
      { name: 'Steganography Encoder', slug: 'steganography-encoder', description: 'Hide text within an image.', icon: Eye, category: 'advanced', implemented: true },
      { name: 'Steganography Decoder', slug: 'steganography-decoder', description: 'Extract text from an image.', icon: Key, category: 'advanced', implemented: true },
      { name: 'Caesar Cipher', slug: 'caesar-cipher', description: 'Simple substitution cipher.', icon: Key, category: 'advanced', implemented: true },
      { name: 'Port Binding Visualizer', slug: 'port-visualizer', description: 'Visualize local port usage.', icon: Briefcase, category: 'advanced', implemented: false },
      { name: 'File Integrity Checker', slug: 'file-integrity-checker', description: 'Generate and verify file checksums.', icon: Database, category: 'advanced', implemented: false },
    ],
  },
];
