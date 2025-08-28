
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Task = {
  id: string;
  content: string;
  completed: boolean;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

function SortableTask({ task, updateTask, removeTask }: { task: Task, updateTask: (id: string, content: string, completed: boolean) => void, removeTask: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 mb-2 bg-secondary rounded-md flex items-center gap-2">
      <Checkbox checked={task.completed} onCheckedChange={(checked) => updateTask(task.id, task.content, !!checked)} />
      <Input value={task.content} onChange={(e) => updateTask(task.id, e.target.value, task.completed)} className="h-8 border-none bg-transparent"/>
      <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}><Trash2 className="h-4 w-4"/></Button>
    </div>
  );
}

function BoardColumn({ column, updateColumnTitle, addTask, updateTask, removeTask, moveTask }: {
  column: Column;
  updateColumnTitle: (id: string, title: string) => void;
  addTask: (columnId: string) => void;
  updateTask: (columnId: string, taskId: string, content: string, completed: boolean) => void;
  removeTask: (columnId: string, taskId: string) => void;
  moveTask: (fromColumnId: string, toColumnId: string, taskId: string) => void;
}) {
  return (
    <Card className="w-80 flex flex-col">
      <CardHeader>
        <Input value={column.title} onChange={(e) => updateColumnTitle(column.id, e.target.value)} className="text-lg font-bold border-none" />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map(task => <SortableTask key={task.id} task={task} updateTask={(id, content, completed) => updateTask(column.id, id, content, completed)} removeTask={(id) => removeTask(column.id, id)} />)}
        </SortableContext>
      </CardContent>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full" onClick={() => addTask(column.id)}><Plus className="mr-2"/> Add task</Button>
      </div>
    </Card>
  );
}


export default function ProjectManagementPage() {
  const [columns, setColumns] = React.useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  
  const updateColumnTitle = (id: string, title: string) => {
    setColumns(columns.map(col => col.id === id ? { ...col, title } : col));
  };
  
  const addTask = (columnId: string) => {
    const newTask = { id: `task-${Date.now()}`, content: 'New Task', completed: false };
    setColumns(columns.map(col => col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col));
  };

  const updateTask = (columnId: string, taskId: string, content: string, completed: boolean) => {
    setColumns(columns.map(col => col.id === columnId ? { ...col, tasks: col.tasks.map(t => t.id === taskId ? { ...t, content, completed } : t) } : col));
  };
  
  const removeTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col => col.id === columnId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col));
  };
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setColumns((items) => {
            // This is a simplified drag-and-drop. It only reorders within a column.
            // A full implementation would handle dragging between columns.
            const activeColumn = items.find(col => col.tasks.some(t => t.id === active.id));
            if (activeColumn) {
                const oldIndex = activeColumn.tasks.findIndex(t => t.id === active.id);
                const newIndex = activeColumn.tasks.findIndex(t => t.id === over.id);
                const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
                return items.map(col => col.id === activeColumn.id ? {...col, tasks: newTasks} : col);
            }
            return items;
        });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map(col => (
                <BoardColumn key={col.id} column={col} updateColumnTitle={updateColumnTitle} addTask={addTask} updateTask={updateTask} removeTask={removeTask} moveTask={() => {}} />
            ))}
        </div>
    </DndContext>
  );
}
