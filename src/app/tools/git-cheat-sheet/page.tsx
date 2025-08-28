
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Command = {
  cmd: string;
  desc: string;
};

const gitCommands = [
  {
    category: 'Setup & Config',
    commands: [
      { cmd: 'git config --global user.name "[name]"', desc: 'Sets the name you want attached to your commit transactions.' },
      { cmd: 'git config --global user.email "[email]"', desc: 'Sets the email you want attached to your commit transactions.' },
      { cmd: 'git config --global --list', desc: 'Lists all global git configurations.' },
    ],
  },
  {
    category: 'Creating Repositories',
    commands: [
      { cmd: 'git init [project-name]', desc: 'Creates a new local repository with the specified name.' },
      { cmd: 'git clone [url]', desc: 'Downloads a project and its entire version history.' },
    ],
  },
  {
    category: 'Making Changes',
    commands: [
      { cmd: 'git status', desc: 'Lists all new or modified files to be committed.' },
      { cmd: 'git add [file]', desc: 'Snapshots the file in preparation for versioning.' },
      { cmd: 'git add .', desc: 'Snapshots all files in the current directory.' },
      { cmd: 'git reset [file]', desc: 'Unstages the file, but preserve its contents.' },
      { cmd: 'git diff', desc: 'Shows file differences not yet staged.' },
      { cmd: 'git diff --staged', desc: 'Shows file differences between staging and the last file version.' },
      { cmd: 'git commit -m "[message]"', desc: 'Records file snapshots permanently in version history.' },
    ],
  },
  {
    category: 'Branching',
    commands: [
      { cmd: 'git branch', desc: 'Lists all local branches in the current repository.' },
      { cmd: 'git branch [branch-name]', desc: 'Creates a new branch.' },
      { cmd: 'git checkout [branch-name]', desc: 'Switches to the specified branch and updates the working directory.' },
      { cmd: 'git merge [branch-name]', desc: 'Combines the specified branch’s history into the current branch.' },
      { cmd: 'git branch -d [branch-name]', desc: 'Deletes the specified branch.' },
    ],
  },
  {
    category: 'Syncing Changes',
    commands: [
      { cmd: 'git fetch', desc: 'Downloads all history from the remote tracking branches.' },
      { cmd: 'git pull', desc: 'Fetches and merges the current branch from the remote.' },
      { cmd: 'git push', desc: 'Uploads all local branch commits to the remote repository.' },
    ],
  },
];

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

export default function GitCheatSheetPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Git Cheat Sheet</CardTitle>
        <CardDescription>A quick reference for common Git commands.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['Setup & Config']}>
          {gitCommands.map(group => (
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
      </CardContent>
    </Card>
  );
}
