
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ALargeSmall, FileWarning, ArrowRight } from 'lucide-react';
import { LegalDisclaimer } from '@/components/legal-disclaimer';

type Rule = {
  type: 'find-replace' | 'add-prefix' | 'add-suffix' | 'change-case';
  find?: string;
  replace?: string;
  prefix?: string;
  suffix?: string;
  caseType?: 'uppercase' | 'lowercase';
};

export default function BatchFileRenamerPage() {
  const [files, setFiles] = React.useState('document.txt\nimage_01.jpg\narchive.zip\nReport-Final.docx');
  const [rule, setRule] = React.useState<Rule>({ type: 'find-replace', find: '', replace: '' });
  const [renamedFiles, setRenamedFiles] = React.useState('');

  const applyRenaming = () => {
    const fileList = files.split('\n').filter(Boolean);
    const newFileNames = fileList.map(file => {
      let newName = file;
      const extension = file.includes('.') ? `.${file.split('.').pop()}` : '';
      const baseName = extension ? file.substring(0, file.lastIndexOf('.')) : file;

      switch (rule.type) {
        case 'find-replace':
          newName = baseName.replace(new RegExp(rule.find || '', 'g'), rule.replace || '') + extension;
          break;
        case 'add-prefix':
          newName = `${rule.prefix || ''}${baseName}${extension}`;
          break;
        case 'add-suffix':
          newName = `${baseName}${rule.suffix || ''}${extension}`;
          break;
        case 'change-case':
          if (rule.caseType === 'uppercase') newName = baseName.toUpperCase() + extension;
          if (rule.caseType === 'lowercase') newName = baseName.toLowerCase() + extension;
          break;
      }
      return newName;
    });
    setRenamedFiles(newFileNames.join('\n'));
  };

  const renderRuleInputs = () => {
    switch (rule.type) {
      case 'find-replace':
        return (
          <div className="flex gap-2">
            <Input placeholder="Find" value={rule.find} onChange={e => setRule({ ...rule, find: e.target.value })} />
            <Input placeholder="Replace with" value={rule.replace} onChange={e => setRule({ ...rule, replace: e.target.value })} />
          </div>
        );
      case 'add-prefix':
        return <Input placeholder="Prefix" value={rule.prefix} onChange={e => setRule({ ...rule, prefix: e.target.value })} />;
      case 'add-suffix':
        return <Input placeholder="Suffix" value={rule.suffix} onChange={e => setRule({ ...rule, suffix: e.target.value })} />;
      case 'change-case':
        return (
          <Select value={rule.caseType} onValueChange={caseType => setRule({ ...rule, caseType: caseType as any })}>
            <SelectTrigger><SelectValue placeholder="Select case" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="lowercase">lowercase</SelectItem>
            </SelectContent>
          </Select>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ALargeSmall /> Batch File Renamer (Simulation)</CardTitle>
          <CardDescription>Simulate renaming many files at once by defining a set of rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <Label htmlFor="original-files">Original Filenames (one per line)</Label>
              <Textarea id="original-files" value={files} onChange={e => setFiles(e.target.value)} className="min-h-[200px] font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Renaming Rule</Label>
              <Select value={rule.type} onValueChange={type => setRule({ type: type as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="find-replace">Find & Replace</SelectItem>
                  <SelectItem value="add-prefix">Add Prefix</SelectItem>
                  <SelectItem value="add-suffix">Add Suffix</SelectItem>
                  <SelectItem value="change-case">Change Case</SelectItem>
                </SelectContent>
              </Select>
              {renderRuleInputs()}
            </div>
          </div>
          <Button onClick={applyRenaming}>Simulate Rename</Button>
          <div className="space-y-2">
            <Label htmlFor="renamed-files">Preview of Renamed Files</Label>
            <Textarea id="renamed-files" value={renamedFiles} readOnly className="min-h-[200px] font-mono bg-muted" />
          </div>
        </CardContent>
      </Card>
      <Alert>
        <FileWarning className="h-4 w-4" />
        <AlertTitle>This is a Simulation</AlertTitle>
        <AlertDescription>
          Web browsers cannot access or rename local files for security reasons. This tool only simulates the renaming process to show you how the output would look. No files on your computer will be affected.
        </AlertDescription>
      </Alert>
      <LegalDisclaimer />
    </div>
  );
}
