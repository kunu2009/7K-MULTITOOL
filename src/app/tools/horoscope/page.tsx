
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { Loader2, Sparkles, Sun, Moon, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces } from 'lucide-react';
import { format } from 'date-fns';

const zodiacSigns = [
    { name: 'Aries', icon: Aries }, { name: 'Taurus', icon: Taurus }, { name: 'Gemini', icon: Gemini },
    { name: 'Cancer', icon: Cancer }, { name: 'Leo', icon: Leo }, { name: 'Virgo', icon: Virgo },
    { name: 'Libra', icon: Libra }, { name: 'Scorpio', icon: Scorpio }, { name: 'Sagittarius', icon: Sagittarius },
    { name: 'Capricorn', icon: Capricorn }, { name: 'Aquarius', icon: Aquarius }, { name: 'Pisces', icon: Pisces }
];

const HoroscopeOutputSchema = z.object({
  horoscope: z.string().describe("A creative and insightful horoscope for the given zodiac sign for today. It should be about 3-4 sentences long."),
});
type HoroscopeOutput = z.infer<typeof HoroscopeOutputSchema>;

export default function HoroscopePage() {
  const [sign, setSign] = React.useState('Aries');
  const [horoscope, setHoroscope] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchHoroscope = React.useCallback(async (zodiacSign: string) => {
    setIsLoading(true);
    setHoroscope(null);
    try {
      const prompt = ai.definePrompt({
        name: 'horoscopePrompt',
        input: { schema: z.object({ sign: z.string(), date: z.string() }) },
        output: { schema: HoroscopeOutputSchema },
        prompt: `Generate a fun, creative, and insightful horoscope for the zodiac sign '{{{sign}}}' for today, '{{{date}}}'. The tone should be positive and encouraging.`,
      });

      const { output } = await prompt({ sign: zodiacSign, date: format(new Date(), 'PPPP') });
      if(output) setHoroscope(output.horoscope);

    } catch (error) {
      console.error(error);
      setHoroscope("Could not fetch the horoscope. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHoroscope(sign);
  }, [sign, fetchHoroscope]);
  
  const Icon = zodiacSigns.find(s => s.name === sign)?.icon || Sun;

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Daily Horoscope</CardTitle>
        <CardDescription>Select your zodiac sign to get your AI-generated daily horoscope.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={sign} onValueChange={setSign}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {zodiacSigns.map(({ name, icon: IconComp }) => (
                <SelectItem key={name} value={name}>
                  <div className="flex items-center gap-2">
                    <IconComp className="h-4 w-4" />
                    <span>{name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="p-6 min-h-[200px] flex flex-col items-center justify-center text-center bg-secondary">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
          {!isLoading && horoscope && (
            <>
              <Icon className="h-10 w-10 mb-4 text-primary" />
              <p className="italic">"{horoscope}"</p>
            </>
          )}
        </Card>
      </CardContent>
    </Card>
  );
}
