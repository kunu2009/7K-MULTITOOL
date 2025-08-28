
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Atom } from 'lucide-react';

type Formula = {
  name: string;
  formula: string;
  description: string;
};

type FormulaCategory = {
  category: string;
  formulas: Formula[];
};

const physicsFormulas: FormulaCategory[] = [
  {
    category: 'Classical Mechanics',
    formulas: [
      { name: 'Velocity', formula: 'v = Δx / Δt', description: 'Change in position over time.' },
      { name: 'Acceleration', formula: 'a = Δv / Δt', description: 'Change in velocity over time.' },
      { name: "Newton's Second Law", formula: 'F = m * a', description: 'Force equals mass times acceleration.' },
      { name: 'Kinetic Energy', formula: 'KE = 0.5 * m * v²', description: 'Energy of motion.' },
      { name: 'Potential Energy (Gravitational)', formula: 'PE = m * g * h', description: 'Stored energy due to height.' },
      { name: 'Momentum', formula: 'p = m * v', description: 'Mass in motion.' },
    ],
  },
  {
    category: 'Electromagnetism',
    formulas: [
      { name: "Ohm's Law", formula: 'V = I * R', description: 'Voltage equals current times resistance.' },
      { name: 'Electric Power', formula: 'P = V * I', description: 'Power equals voltage times current.' },
      { name: "Coulomb's Law", formula: 'F = k * |q1*q2| / r²', description: 'Force between two point charges.' },
    ],
  },
  {
    category: 'Thermodynamics',
    formulas: [
      { name: 'Ideal Gas Law', formula: 'PV = nRT', description: 'Relates pressure, volume, and temperature of a gas.' },
      { name: 'First Law of Thermodynamics', formula: 'ΔU = Q - W', description: 'Conservation of energy.' },
    ],
  },
  {
    category: 'Relativity',
    formulas: [
      { name: 'Mass-Energy Equivalence', formula: 'E = mc²', description: "Energy equals mass times the speed of light squared." },
    ],
  },
];

const FormulaItem = ({ formula }: { formula: Formula }) => (
    <div className="p-3 border-l-2 border-primary/50 bg-secondary/50 rounded-r-md">
        <p className="font-mono text-lg text-primary">{formula.formula}</p>
        <p className="font-semibold">{formula.name}</p>
        <p className="text-sm text-muted-foreground">{formula.description}</p>
    </div>
);

export default function PhysicsFormulasPage() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredFormulas = React.useMemo(() => {
        if (!searchTerm) return physicsFormulas;
        
        const lowerCaseSearch = searchTerm.toLowerCase();

        return physicsFormulas.map(category => {
            const filtered = category.formulas.filter(
                f => f.name.toLowerCase().includes(lowerCaseSearch) || 
                     f.description.toLowerCase().includes(lowerCaseSearch) ||
                     f.formula.toLowerCase().replace(/\s/g, '').includes(lowerCaseSearch.replace(/\s/g, ''))
            );
            return { ...category, formulas: filtered };
        }).filter(category => category.formulas.length > 0);

    }, [searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Atom/> Physics Formula Sheet</CardTitle>
        <CardDescription>A searchable library of common physics formulas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
            placeholder="Search for a formula (e.g., 'F = m*a' or 'Kinetic Energy')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Accordion type="multiple" defaultValue={['Classical Mechanics', 'Electromagnetism']}>
          {filteredFormulas.map(group => (
            <AccordionItem value={group.category} key={group.category}>
              <AccordionTrigger>{group.category}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {group.formulas.map(formula => (
                    <FormulaItem key={formula.name} formula={formula} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {filteredFormulas.length === 0 && <p className="text-center text-muted-foreground">No formulas found for "{searchTerm}".</p>}
      </CardContent>
    </Card>
  );
}
