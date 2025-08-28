
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';

type JournalEntry = {
  date: string; // YYYY-MM-DD
  content: string;
};

export default function JournalPage() {
  const [entries, setEntries] = React.useState<Record<string, JournalEntry>>({});
  const [selectedDate, setSelectedDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('journal-entries');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error("Failed to load journal entries from localStorage", error);
    }
  }, []);

  const saveEntry = () => {
    const newEntries = { ...entries, [selectedDate]: { date: selectedDate, content: entries[selectedDate]?.content || '' } };
    setEntries(newEntries);
    localStorage.setItem('journal-entries', JSON.stringify(newEntries));
    toast({ title: `Entry for ${format(new Date(selectedDate), 'PPP')} saved!` });
  };
  
  const handleContentChange = (content: string) => {
    setEntries(prev => ({
      ...prev,
      [selectedDate]: { date: selectedDate, content }
    }));
  };

  const deleteEntry = () => {
    const { [selectedDate]: _, ...remainingEntries } = entries;
    setEntries(remainingEntries);
    localStorage.setItem('journal-entries', JSON.stringify(remainingEntries));
    toast({ title: `Entry for ${format(new Date(selectedDate), 'PPP')} deleted.`, variant: 'destructive' });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  }

  const handleDownload = () => {
      const content = Object.values(entries).map(e => `## ${e.date}\n\n${e.content}`).join('\n\n---\n\n');
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'journal.md';
      link.click();
      URL.revokeObjectURL(url);
  }

  const currentContent = entries[selectedDate]?.content || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Journal / Diary</CardTitle>
        <CardDescription>A secure place for your daily thoughts, saved locally in your browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative">
                <input type="date" value={selectedDate} onChange={handleDateChange} className="p-2 border rounded-md bg-transparent" />
            </div>
            <div className="flex gap-2">
                <Button onClick={saveEntry}><Save className="mr-2"/> Save Entry</Button>
                <Button onClick={deleteEntry} variant="destructive" disabled={!currentContent}><Trash2 className="mr-2"/> Delete Entry</Button>
                 <Button onClick={handleDownload} variant="outline" disabled={Object.keys(entries).length === 0}><Download className="mr-2"/> Export All</Button>
            </div>
        </div>
        <Textarea
          value={currentContent}
          onChange={e => handleContentChange(e.target.value)}
          placeholder={`What's on your mind today, ${format(new Date(selectedDate), 'PPPP')}?`}
          className="min-h-[60vh]"
        />
      </CardContent>
    </Card>
  );
}
