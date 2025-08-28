
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Course = {
  id: number;
  name: string;
  credits: string;
  grade: string;
};

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

export default function GpaCalculatorPage() {
  const [courses, setCourses] = React.useState<Course[]>([{ id: 1, name: '', credits: '', grade: 'A' }]);
  const [gpa, setGpa] = React.useState(0);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', credits: '', grade: 'A' }]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
  };
  
  const updateCourse = (id: number, field: keyof Omit<Course, 'id'>, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  React.useEffect(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      const points = gradePoints[course.grade];
      if (!isNaN(credits) && credits > 0 && points !== undefined) {
        totalPoints += credits * points;
        totalCredits += credits;
      }
    });
    setGpa(totalCredits > 0 ? totalPoints / totalCredits : 0);
  }, [courses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>GPA Calculator</CardTitle>
        <CardDescription>Calculate your Grade Point Average.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            {courses.map((course, index) => (
                <div key={course.id} className="flex gap-2 items-center">
                    <Input placeholder={`Course ${index + 1}`} value={course.name} onChange={e => updateCourse(course.id, 'name', e.target.value)} />
                    <Input type="number" placeholder="Credits" value={course.credits} onChange={e => updateCourse(course.id, 'credits', e.target.value)} className="w-24"/>
                    <Select value={course.grade} onValueChange={value => updateCourse(course.id, 'grade', value)}>
                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {Object.keys(gradePoints).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)}><Trash2 /></Button>
                </div>
            ))}
        </div>
        <Button onClick={addCourse}><Plus className="mr-2"/> Add Course</Button>
        <div className="pt-4">
            <Card className="p-6 flex flex-col items-center">
                <p className="text-muted-foreground">Your GPA is</p>
                <p className="text-4xl font-bold">{gpa.toFixed(2)}</p>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
