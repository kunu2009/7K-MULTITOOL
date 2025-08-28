
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toolsConfig } from '@/config/tools';

export default function ToolsDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">7K MultiTool</h1>
        <p className="text-muted-foreground mt-2">
          A collection of legal, educational, and useful tools across security, developer, and general utility categories.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {toolsConfig.flatMap(category => category.tools).map((tool) => (
          <Link href={tool.implemented ? `/tools/${tool.slug}` : '#'} key={tool.slug} className={!tool.implemented ? 'pointer-events-none' : ''}>
            <Card className={`h-full transition-all hover:shadow-md ${!tool.implemented ? 'opacity-50' : 'hover:border-primary'}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                  <tool.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription className="mt-1">{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
