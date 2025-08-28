
import { z } from 'genkit';

const UserSchema = z.object({
    name: z.string().describe('The full name of the user.'),
    email: z.string().email().describe('The user\'s email address.'),
    address: z.string().describe('The user\'s full street address.'),
});

export const FakeDataOutputSchema = z.object({
  users: z.array(UserSchema).describe('A list of generated fake users.'),
});
export type FakeDataOutput = z.infer<typeof FakeDataOutputSchema>;
