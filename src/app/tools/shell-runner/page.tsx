
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalDisclaimer } from '@/components/legal-disclaimer';
import { Loader2, Terminal, AlertTriangle, ShieldQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ShellOutputSchema = z.object({
  output: z.string().describe("The predicted standard output of the shell command."),
  explanation: z.string().describe("A brief explanation of what the command does."),
});
type ShellOutput = z.infer<typeof ShellOutputSchema>;

type ShellState = {
  data: ShellOutput | null;
  message: string | null;
};

const initialState: ShellState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Terminal className="mr-2 h-4 w-4" />}
      {pending ? 'Simulating...' : 'Run Simulation'}
    </Button>
  );
}

export default function ShellRunnerPage() {
  const [state, setState] = React.useState<ShellState>(initialState);
  const [command, setCommand] = React.useState('ls -la');

  const formAction = async (formData: FormData) => {
    const cmd = formData.get('command') as string;
    if (!cmd) {
        setState({ data: null, message: 'Please enter a command.' });
        return;
    }

    const dangerousCommands = ['rm', 'sudo', 'mkfs', 'dd', ':', 'shutdown', 'reboot', 'userdel', 'groupdel'];
    if (dangerousCommands.some(c => cmd.trim().startsWith(c))) {
        setState({ data: null, message: 'This command is too dangerous to simulate.' });
        return;
    }

    setState(prevState => ({...prevState, data: null, message: null}));

    try {
        const prompt = ai.definePrompt({
            name: 'shellSimulatorPrompt',
            input: {schema: z.object({ command: z.string() })},
            output: {schema: ShellOutputSchema},
            prompt: `You are a shell command simulator. Given the following safe, read-only command, predict its output and provide a brief explanation. Do not simulate dangerous or system-altering commands.

Command: {{{command}}}
`,
        });
        
        const { output } = await prompt({ command: cmd });
        setState({ data: output, message: null });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setState({ data: null, message: `An error occurred: ${errorMessage}` });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Terminal className="h-6 w-6" /> Educational Shell Simulator</CardTitle>
          <CardDescription>Safely learn about shell commands by simulating their output with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="command">Command</Label>
              <Input
                id="command"
                name="command"
                value={command}
                onChange={e => setCommand(e.target.value)}
                placeholder="e.g., ls -la"
                className="mt-1 font-mono"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>This is a Simulation, NOT a Real Terminal</AlertTitle>
          <AlertDescription>
            No code is actually executed. The AI predicts the output for common, safe commands. Do not enter sensitive information. Dangerous commands are blocked.
          </AlertDescription>
      </Alert>

      {state.message && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.data && (
        <Card>
          <CardHeader>
            <CardTitle>Simulated Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label>Explanation</Label>
                <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{state.data.explanation}</p>
            </div>
            <div>
                <Label>Output</Label>
                <pre className="p-4 bg-gray-900 text-white rounded-md font-mono text-sm overflow-x-auto">
                    <code>{state.data.output}</code>
                </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <LegalDisclaimer />
    </div>
  );
}
