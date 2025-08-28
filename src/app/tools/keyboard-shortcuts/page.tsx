
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Shortcut = {
  keys: string;
  desc: string;
};

const shortcutsData: Record<string, Shortcut[]> = {
  vscode: [
    { keys: 'Ctrl+P', desc: 'Go to File' },
    { keys: 'Ctrl+Shift+P', desc: 'Show Command Palette' },
    { keys: 'Ctrl+Shift+N', desc: 'New window/instance' },
    { keys: 'Ctrl+Shift+W', desc: 'Close window/instance' },
    { keys: 'Ctrl+B', desc: 'Toggle Sidebar visibility' },
    { keys: 'Ctrl+`', desc: 'Toggle Integrated Terminal' },
  ],
  windows: [
    { keys: 'Win+D', desc: 'Show or hide the desktop' },
    { keys: 'Win+E', desc: 'Open File Explorer' },
    { keys: 'Win+I', desc: 'Open Settings' },
    { keys: 'Win+L', desc: 'Lock your PC' },
    { keys: 'Win+Tab', desc: 'Open Task View' },
    { keys: 'Ctrl+Shift+Esc', desc: 'Open Task Manager' },
  ],
  macos: [
    { keys: 'Cmd+Space', desc: 'Show or hide Spotlight search' },
    { keys: 'Cmd+Tab', desc: 'Switch to the next most recently used app' },
    { keys: 'Cmd+Q', desc: 'Quit the foremost app' },
    { keys: 'Cmd+H', desc: 'Hide the windows of the front app' },
    { keys: 'Cmd+Option+Esc', desc: 'Force quit an app' },
    { keys: 'Cmd+Shift+5', desc: 'Take a screenshot or make a screen recording' },
  ]
};

export default function KeyboardShortcutsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredShortcuts = (category: string) => 
    shortcutsData[category].filter(s => 
      s.keys.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard Shortcuts</CardTitle>
        <CardDescription>A quick reference for common application shortcuts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vscode">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <TabsList>
              <TabsTrigger value="vscode">VS Code</TabsTrigger>
              <TabsTrigger value="windows">Windows</TabsTrigger>
              <TabsTrigger value="macos">macOS</TabsTrigger>
            </TabsList>
            <Input 
              placeholder="Search shortcuts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {Object.keys(shortcutsData).map(key => (
            <TabsContent key={key} value={key}>
              <div className="space-y-2 mt-4">
                {filteredShortcuts(key).map(shortcut => (
                  <div key={shortcut.keys} className="flex justify-between items-center p-3 bg-secondary rounded-md">
                    <p>{shortcut.desc}</p>
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{shortcut.keys}</kbd>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
