
import {z} from 'genkit';

export const PasswordBreachCheckInputSchema = z.object({
  password: z.string().describe('The password to check for in data breaches.'),
});
export type PasswordBreachCheckInput = z.infer<typeof PasswordBreachCheckInputSchema>;

export const PasswordBreachCheckOutputSchema = z.object({
  isPwned: z.boolean().describe('Whether the password was found in a data breach.'),
  message: z.string().describe("A helpful message explaining the result. If it was pwned, mention how many times and suggest not to use it. If not pwned, congratulate the user."),
});
export type PasswordBreachCheckOutput = z.infer<typeof PasswordBreachCheckOutputSchema>;
