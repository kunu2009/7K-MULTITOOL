'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


type Strength = {
  score: number;
  text: string;
  color: string;
};

const STRENGTH_LEVELS: Strength[] = [
  { score: 0, text: 'Very Weak', color: 'bg-red-500' },
  { score: 1, text: 'Weak', color: 'bg-orange-500' },
  { score: 2, text: 'Medium', color: 'bg-yellow-500' },
  { score: 3, text: 'Strong', color: 'bg-green-500' },
  { score: 4, text: 'Very Strong', color: 'bg-emerald-500' },
];

export default function PasswordStrengthCheckerPage() {
  const [password, setPassword] = React.useState('');
  const [strength, setStrength] = React.useState<Strength>(STRENGTH_LEVELS[0]);

  const checks = React.useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  React.useEffect(() => {
    let score = 0;
    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;
    if (password.length > 12) score++;

    // Adjust score to be within the STRENGTH_LEVELS array bounds
    const finalScore = Math.min(Math.floor(score / 1.5), STRENGTH_LEVELS.length - 1);
    setStrength(STRENGTH_LEVELS[finalScore] || STRENGTH_LEVELS[0]);
  }, [password, checks]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Strength Checker</CardTitle>
          <CardDescription>Evaluate your password strength based on several criteria.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Enter Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password to check its strength"
                className="mt-1"
                aria-label="Password input for strength checking"
              />
            </div>
            {password.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Progress value={strength.score * 25} className={`h-2 [&>div]:${strength.color}`} aria-label={`Password strength: ${strength.text}`} />
                  <p className="text-sm font-medium" style={{ color: strength.color.replace('bg-', '').replace('-500', '') }}>
                    Strength: {strength.text}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className={`flex items-center gap-2 ${checks.length ? 'text-green-600' : 'text-red-600'}`}>
                    {checks.length ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                    <span>At least 8 characters long</span>
                  </div>
                  <div className={`flex items-center gap-2 ${checks.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                    {checks.uppercase ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                    <span>Contains an uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${checks.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                    {checks.lowercase ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                    <span>Contains a lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${checks.number ? 'text-green-600' : 'text-red-600'}`}>
                    {checks.number ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                    <span>Contains a number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${checks.special ? 'text-green-600' : 'text-red-600'}`}>
                    {checks.special ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                    <span>Contains a special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            What Makes a Strong Password?
          </CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible defaultValue="length">
            <AccordionItem value="length">
              <AccordionTrigger>Length</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">The single most important factor. Each character you add increases the password's complexity exponentially, making it much harder to crack through brute-force attacks. Aim for at least 12-16 characters.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="complexity">
              <AccordionTrigger>Complexity & Character Variety</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">Using a mix of uppercase letters, lowercase letters, numbers, and special characters (like `!@#$%^&*`) dramatically expands the pool of possible characters for each position, making the password harder to guess.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="unpredictability">
              <AccordionTrigger>Unpredictability</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">Avoid using common words, phrases, or personal information (like your name, birthday, or pet's name). Dictionary attacks specifically target these. Creating a random string of characters is ideal, but a long, unique passphrase can also be very effective (e.g., "Correct-Horse-Battery-Staple").</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="uniqueness">
              <AccordionTrigger>Uniqueness</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">Never reuse passwords across different websites or services. If one site is breached, attackers will try the same email and password combination on many other sites. Using a password manager is the best way to generate and store unique, strong passwords for every account.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <LegalDisclaimer />
    </div>
  );
}
