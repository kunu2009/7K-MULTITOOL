
'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { generateFakeDataAction, FakeDataState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Clipboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const initialState: FakeDataState = {
  data: null,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
      {pending ? 'Generating...' : 'Generate 10 Users'}
    </Button>
  );
}

export default function FakeDataGeneratorPage() {
  const [state, setState] = React.useState<FakeDataState>(initialState);
  const { toast } = useToast();

  const formAction = async (formData: FormData) => {
    const result = await generateFakeDataAction(initialState, formData);
    setState(result);
  };
  
  const handleCopy = () => {
    if (state.data?.users) {
        navigator.clipboard.writeText(JSON.stringify(state.data.users, null, 2));
        toast({ title: 'Copied to clipboard', description: 'User data copied as JSON.' });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Fake Data Generator</CardTitle>
          <CardDescription>Generate realistic-looking fake user data for testing and development.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      {state.message && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {state.data?.users && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Generated Users</CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Clipboard className="mr-2 h-4 w-4" /> Copy JSON
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {state.data.users.map((user) => (
                        <TableRow key={user.email}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.address}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
