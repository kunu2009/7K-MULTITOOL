
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Copy } from 'lucide-react';

type Snippet = {
  id: string;
  title: string;
  code: string;
};

export default function SnippetManagerPage() {
  const [snippets, setSnippets] = React.useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = React.useState<Snippet | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedSnippets = localStorage.getItem('code-snippets');
      if (savedSnippets) {
        setSnippets(JSON.parse(savedSnippets));
      }
    } catch (error) {
      console.error("Failed to load snippets from localStorage", error);
    }
  }, []);

  const saveSnippets = (newSnippets: Snippet[]) => {
    setSnippets(newSnippets);
    localStorage.setItem('code-snippets', JSON.stringify(newSnippets));
  };

  const handleNew = () => {
    const newSnippet: Snippet = { id: Date.now().toString(), title: 'New Snippet', code: '' };
    const newSnippets = [...snippets, newSnippet];
    saveSnippets(newSnippets);
    setSelectedSnippet(newSnippet);
  };

  const handleSave = () => {
    if (!selectedSnippet) return;
    const newSnippets = snippets.map(s => s.id === selectedSnippet.id ? selectedSnippet : s);
    saveSnippets(newSnippets);
    toast({ title: 'Snippet saved!' });
  };
  
  const handleDelete = () => {
    if (!selectedSnippet) return;
    const newSnippets = snippets.filter(s => s.id !== selectedSnippet.id);
    saveSnippets(newSnippets);
    setSelectedSnippet(null);
    toast({ title: 'Snippet deleted.' });
  }

  const handleCopy = () => {
    if (!selectedSnippet) return;
    navigator.clipboard.writeText(selectedSnippet.code);
    toast({ title: 'Code copied!' });
  }

  return (
    <div className="grid md:grid-cols-[1fr_3fr] gap-6 h-[80vh]">
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Snippets</CardTitle>
            <Button size="icon" variant="ghost" onClick={handleNew}><Plus /></Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {snippets.length === 0 && <p className="text-sm text-muted-foreground">No snippets yet.</p>}
          <div className="space-y-2">
            {snippets.map(snippet => (
              <Button
                key={snippet.id}
                variant={selectedSnippet?.id === snippet.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedSnippet(snippet)}
              >
                {snippet.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        {selectedSnippet ? (
          <>
            <CardHeader>
              <Input
                value={selectedSnippet.title}
                onChange={e => setSelectedSnippet({ ...selectedSnippet, title: e.target.value })}
                className="text-lg font-bold"
              />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea
                value={selectedSnippet.code}
                onChange={e => setSelectedSnippet({ ...selectedSnippet, code: e.target.value })}
                className="flex-1 font-mono"
                placeholder="Your code snippet here..."
              />
              <div className="flex gap-2">
                <Button onClick={handleSave}><Save className="mr-2" /> Save</Button>
                <Button variant="outline" onClick={handleCopy}><Copy className="mr-2" /> Copy</Button>
                <Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2" /> Delete</Button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Select a snippet or create a new one.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
