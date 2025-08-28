
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { toolsConfig } from '@/config/tools';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar side="right" collapsible="icon">
        <SidebarHeader className="justify-end">
          <div className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <h1 className="text-lg font-semibold">7K MultiTool</h1>
          </div>
           <div className="flex-1" />
           <SidebarTrigger className="hidden md:flex" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {toolsConfig.map((category) => (
              <SidebarGroup key={category.id}>
                <SidebarGroupLabel>{category.name}</SidebarGroupLabel>
                {category.tools.map((tool) => (
                  <SidebarMenuItem key={tool.slug}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/tools/${tool.slug}`}
                      disabled={!tool.implemented}
                      tooltip={{
                        children: tool.name,
                        side: 'left',
                        align: 'center',
                      }}
                    >
                      <Link href={tool.implemented ? `/tools/${tool.slug}` : '#'}>
                        <tool.icon className="size-4" />
                        <span>{tool.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroup>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Github className="size-4" />
            <span>GitHub</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between border-b p-2 pr-4 md:pr-2">
            <div className="flex items-center gap-2 md:hidden">
              <SidebarTrigger />
               <div className="flex items-center gap-2">
                <Logo className="size-6 text-primary" />
                <h1 className="text-md font-semibold">7K MultiTool</h1>
              </div>
            </div>
            <div className="hidden md:block">
              {/* This space can be used for a breadcrumb or title in the future */}
            </div>
            <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
