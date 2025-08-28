
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Copy, Notebook } from 'lucide-react';

type Snippet = {
  id: string;
  shortcode: string;
  phrase: string;
};

export default function TextExpanderPage() {
  const [snippets, setSnippets] = React.useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = React.useState<Snippet | null>(null);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedSnippets = localStorage.getItem('text-expander-snippets');
      if (savedSnippets) {
        const parsedSnippets = JSON.parse(savedSnippets);
        setSnippets(parsedSnippets);
      }
    } catch (error) {
      console.error("Failed to load snippets from localStorage", error);
    }
  }, []);

  const saveSnippets = (newSnippets: Snippet[]) => {
    setSnippets(newSnippets);
    localStorage.setItem('text-expander-snippets', JSON.stringify(newSnippets));
  };

  const handleNew = () => {
    const newSnippet: Snippet = { id: Date.now().toString(), shortcode: ':new', phrase: 'New phrase' };
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

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    const lastWord = value.split(/\s+/).pop() || '';
    
    const snippet = snippets.find(s => s.shortcode === lastWord);
    if (snippet) {
      const regex = new RegExp(`${snippet.shortcode}$`);
      value = value.replace(regex, snippet.phrase);
    }
    
    setTextAreaValue(value);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Notebook /> Snippet Manager</CardTitle>
          <CardDescription>Define shortcodes that expand into longer phrases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold">Your Snippets</h3>
            <Button size="sm" variant="ghost" onClick={handleNew}><Plus className="mr-2" /> New Snippet</Button>
          </div>
           <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {snippets.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No snippets yet.</p>}
            {snippets.map(snippet => (
              <Button
                key={snippet.id}
                variant={selectedSnippet?.id === snippet.id ? 'secondary' : 'ghost'}
                className="w-full justify-start h-auto"
                onClick={() => setSelectedSnippet(snippet)}
              >
                <div className="flex flex-col items-start">
                    <span className="font-mono text-primary">{snippet.shortcode}</span>
                    <span className="text-muted-foreground whitespace-normal text-left">{snippet.phrase}</span>
                </div>
              </Button>
            ))}
          </div>
          {selectedSnippet && (
            <div className="space-y-4 pt-4 border-t">
                 <div className="space-y-1">
                    <Label htmlFor="shortcode">Shortcode</Label>
                    <Input 
                        id="shortcode" 
                        value={selectedSnippet.shortcode}
                        onChange={e => setSelectedSnippet({...selectedSnippet, shortcode: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="phrase">Phrase</Label>
                    <Textarea 
                        id="phrase"
                        value={selectedSnippet.phrase}
                        onChange={e => setSelectedSnippet({...selectedSnippet, phrase: e.target.value})}
                    />
                 </div>
                 <div className="flex gap-2">
                    <Button onClick={handleSave}><Save className="mr-2" /> Save</Button>
                    <Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2" /> Delete</Button>
                 </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Try it out</CardTitle>
            <CardDescription>Type one of your shortcodes followed by a space to see it expand.</CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea 
                value={textAreaValue}
                onChange={handleTextAreaChange}
                className="min-h-[400px] font-mono"
            />
        </CardContent>
      </Card>
    </div>
  );
}
