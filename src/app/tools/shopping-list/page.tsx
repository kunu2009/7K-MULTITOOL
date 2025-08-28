
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Item = {
  id: string;
  name: string;
  done: boolean;
};

export default function ShoppingListPage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [newItem, setNewItem] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    const savedItems = localStorage.getItem('shopping-list');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);
  
  const saveItems = (newItems: Item[]) => {
      setItems(newItems);
      localStorage.setItem('shopping-list', JSON.stringify(newItems));
  }

  const addItem = () => {
    if (!newItem.trim()) return;
    const newItems = [...items, { id: Date.now().toString(), name: newItem, done: false }];
    saveItems(newItems);
    setNewItem('');
  };
  
  const toggleItem = (id: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, done: !item.done } : item);
    saveItems(newItems);
  }
  
  const deleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    saveItems(newItems);
  }

  const clearList = () => {
      saveItems([]);
      toast({title: "List cleared!"})
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
        <CardDescription>A simple list to track your shopping needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
            <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="e.g., Milk, Bread, Eggs" onKeyDown={(e) => e.key === 'Enter' && addItem()} />
            <Button onClick={addItem}><Plus /></Button>
        </div>

        <div className="space-y-2">
            {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                    <Checkbox id={`item-${item.id}`} checked={item.done} onCheckedChange={() => toggleItem(item.id)} />
                    <Label htmlFor={`item-${item.id}`} className={`flex-1 ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.name}</Label>
                    <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4"/></Button>
                </div>
            ))}
            {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Your list is empty.</p>}
        </div>
        
        {items.length > 0 && <Button variant="outline" onClick={clearList}>Clear All</Button>}
      </CardContent>
    </Card>
  );
}
