
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Command = {
  cmd: string;
  desc: string;
};

type CheatSheetData = {
  category: string;
  commands: Command[];
};

const cheatSheets: Record<string, CheatSheetData[]> = {
  git: [
    {
      category: 'Setup & Config',
      commands: [
        { cmd: 'git config --global user.name "[name]"', desc: 'Sets the name you want attached to your commit transactions.' },
        { cmd: 'git config --global user.email "[email]"', desc: 'Sets the email you want attached to your commit transactions.' },
      ],
    },
    {
      category: 'Making Changes',
      commands: [
        { cmd: 'git status', desc: 'Lists all new or modified files to be committed.' },
        { cmd: 'git add [file]', desc: 'Snapshots the file in preparation for versioning.' },
        { cmd: 'git commit -m "[message]"', desc: 'Records file snapshots permanently in version history.' },
      ],
    },
    {
      category: 'Branching',
      commands: [
        { cmd: 'git branch', desc: 'Lists all local branches.' },
        { cmd: 'git checkout [branch-name]', desc: 'Switches to the specified branch.' },
        { cmd: 'git merge [branch-name]', desc: 'Combines the branch’s history into the current branch.' },
      ],
    },
    {
      category: 'Syncing Changes',
      commands: [
        { cmd: 'git fetch', desc: 'Downloads all history from the remote.' },
        { cmd: 'git pull', desc: 'Fetches and merges the current branch from the remote.' },
        { cmd: 'git push', desc: 'Uploads all local branch commits to the remote.' },
      ],
    },
  ],
  linux: [
    {
        category: "File System",
        commands: [
            { cmd: "ls -la", desc: "List all files in long format." },
            { cmd: "cd /path/to/dir", desc: "Change directory." },
            { cmd: "pwd", desc: "Show current directory." },
            { cmd: "mkdir new_dir", desc: "Create a new directory." },
        ]
    },
    {
        category: "System Info",
        commands: [
            { cmd: "uname -a", desc: "Show kernel and system information." },
            { cmd: "df -h", desc: "Show disk space usage." },
            { cmd: "top", desc: "Display running processes." },
        ]
    }
  ],
  sql: [
     {
        category: "Basic Queries",
        commands: [
            { cmd: "SELECT * FROM table;", desc: "Select all records from a table." },
            { cmd: "SELECT col1, col2 FROM table;", desc: "Select specific columns from a table." },
            { cmd: "SELECT * FROM table WHERE condition;", desc: "Select records based on a condition." },
        ]
    },
    {
        category: "Data Manipulation",
        commands: [
            { cmd: "INSERT INTO table (col1) VALUES (val1);", desc: "Insert a new record." },
            { cmd: "UPDATE table SET col1 = val1 WHERE id = 1;", desc: "Update an existing record." },
            { cmd: "DELETE FROM table WHERE id = 1;", desc: "Delete a record." },
        ]
    }
  ]
};

const CommandItem = ({ cmd, desc }: Command) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    toast({ title: 'Copied to clipboard' });
  };
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
      <div>
        <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-1 rounded">{cmd}</code>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      <Button size="icon" variant="ghost" onClick={handleCopy}><Copy className="h-4 w-4"/></Button>
    </div>
  );
};

export default function CheatSheetPage() {
  const [activeTab, setActiveTab] = React.useState('git');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheat Sheets Hub</CardTitle>
        <CardDescription>A quick reference for common commands and syntaxes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="git">Git</TabsTrigger>
            <TabsTrigger value="linux">Linux</TabsTrigger>
            <TabsTrigger value="sql">SQL</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <Accordion type="multiple" defaultValue={['Setup & Config', 'File System', 'Basic Queries']}>
              {cheatSheets[activeTab]?.map(group => (
                <AccordionItem value={group.category} key={group.category}>
                  <AccordionTrigger>{group.category}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {group.commands.map(command => (
                        <CommandItem key={command.cmd} {...command} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
